import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { OverviewScreen } from "./overview-screen"
import { Overview } from "./overview"
import { rules, suggestion, trackRecord, welcome } from "./data"
import { formatUsd } from "./format"
import { LessonLayer } from "./learn/lesson-layer"
import { conceptById, lesson } from "./learn/data"
import { lossIfDrop } from "./learn/math"
import { finishedSession, renderWithDemo } from "./test-utils"

const search = vi.hoisted(() => ({ params: new URLSearchParams() }))

vi.mock("next/navigation", () => ({ useSearchParams: () => search.params }))
vi.mock("sonner", () => ({ toast: vi.fn() }))

const concept = conceptById("concentration")
// The prompt's name is its title plus its hint.
const lessonPrompt = () =>
  screen.getByRole("button", {
    name: (name) => name.startsWith(suggestion.lesson),
  })
const ring = () =>
  screen.getByRole("progressbar", { name: "Lessons completed" })

function renderFirstRun(level: "new" | "experienced" = "new") {
  return renderWithDemo(
    <>
      <Overview />
      <LessonLayer />
    </>,
    { session: { ...finishedSession, level } },
  )
}

/** Walks the lesson to its quick check and answers it right. */
async function takeLesson(user: ReturnType<typeof userEvent.setup>) {
  await user.click(lessonPrompt())
  const panel = await screen.findByRole("dialog", { name: concept.title })
  for (let step = 0; step < 4; step++) {
    await user.click(within(panel).getByRole("button", { name: lesson.next }))
  }
  const right = lesson.steps.check.options.find((o) => "correct" in o)!
  await user.click(within(panel).getByRole("button", { name: right.label }))
  return panel
}

describe("first run (arriving from /demo)", () => {
  beforeEach(() => {
    search.params = new URLSearchParams()
  })

  it("greets the persona by name, with a fresh account and no history", () => {
    renderWithDemo(<OverviewScreen />, { session: finishedSession })

    expect(
      screen.getAllByText(welcome.connected.title("Maya", 4))[0],
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole("heading", { name: "Good morning, Maya" })[0],
    ).toBeInTheDocument()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("starts the track record today, misses included", () => {
    renderFirstRun()

    expect(
      screen.getByText(trackRecord.firstRun.description),
    ).toBeInTheDocument()
    expect(screen.getByText(trackRecord.firstRun.noMisses)).toBeInTheDocument()
    expect(
      screen.queryByText(trackRecord.misses[0].label),
    ).not.toBeInTheDocument()
    expect(ring()).toHaveAttribute("aria-valuenow", "0")
  })

  it("teaches before the decision: slider, quick check, concept learned", async () => {
    const user = userEvent.setup()
    renderFirstRun()

    await user.click(lessonPrompt())
    const panel = await screen.findByRole("dialog", { name: concept.title })
    expect(
      within(panel).getByText(lesson.steps.exposure.title),
    ).toBeInTheDocument()

    await user.click(within(panel).getByRole("button", { name: lesson.next }))
    expect(
      within(panel).getByText(formatUsd(lossIfDrop(0.3))),
    ).toBeInTheDocument()
    fireEvent.change(within(panel).getByLabelText(lesson.steps.whatIf.slider), {
      target: { value: "50" },
    })
    expect(
      within(panel).getByText(formatUsd(lossIfDrop(0.5))),
    ).toBeInTheDocument()

    for (let step = 0; step < 3; step++) {
      await user.click(within(panel).getByRole("button", { name: lesson.next }))
    }
    const [wrong] = lesson.steps.check.options
    await user.click(within(panel).getByRole("button", { name: wrong.label }))
    expect(within(panel).getByText(wrong.feedback)).toBeInTheDocument()
    expect(
      within(panel).queryByText(lesson.steps.check.learned),
    ).not.toBeInTheDocument()

    const right = lesson.steps.check.options.find((o) => "correct" in o)!
    await user.click(within(panel).getByRole("button", { name: right.label }))
    expect(
      within(panel).getByText(lesson.steps.check.learned),
    ).toBeInTheDocument()
    // The reward: XP and the first day of a streak.
    expect(within(panel).getByText("+20 XP")).toBeInTheDocument()
    expect(within(panel).getByText("1-day streak")).toBeInTheDocument()
    await user.click(within(panel).getByRole("button", { name: lesson.close }))

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: concept.title }),
      ).not.toBeInTheDocument(),
    )
    expect(ring()).toHaveAttribute("aria-valuenow", "1")
    expect(screen.getByText(suggestion.lessonDone)).toBeInTheDocument()
  })

  it("earns Autopilot for the 12% rule: learn, approve once, turn it on", async () => {
    const user = userEvent.setup()
    renderFirstRun()
    expect(screen.getByText(rules.autopilot.locked)).toBeInTheDocument()

    await takeLesson(user)
    await user.click(screen.getByRole("button", { name: lesson.close }))
    expect(screen.getByText(rules.autopilot.almost)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Approve" }))
    expect(
      await screen.findByText(
        suggestion.receipt.informed,
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(suggestion.receipt.unlockReady)).toBeInTheDocument()

    const toggle = screen.getByRole("switch", { name: rules.autopilot.toggle })
    expect(toggle).not.toBeChecked()
    expect(screen.getByText(rules.autopilot.note)).toBeInTheDocument()

    await user.click(toggle)
    expect(toggle).toBeChecked()
    expect(screen.getByText(rules.autopilot.on)).toBeInTheDocument()
  })

  it("approving without the lesson points back at it", async () => {
    const user = userEvent.setup()
    renderFirstRun()

    await user.click(screen.getByRole("button", { name: "Approve" }))

    expect(
      await screen.findByText(
        suggestion.receipt.learnToUnlock,
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(suggestion.receipt.informed),
    ).not.toBeInTheDocument()
    // Approved, but not learned: the 12% rule stays locked.
    expect(screen.getByText(rules.autopilot.locked)).toBeInTheDocument()
  })

  it("keeps the prompt quiet for experienced investors", () => {
    renderFirstRun("experienced")

    expect(
      screen.getByRole("button", { name: suggestion.lessonShort }),
    ).toBeInTheDocument()
    expect(screen.queryByText(suggestion.lessonHint)).not.toBeInTheDocument()
  })

  it("resets the lesson and Autopilot with the demo", async () => {
    const user = userEvent.setup()
    renderFirstRun()
    await takeLesson(user)
    await user.click(screen.getByRole("button", { name: lesson.close }))
    await user.click(screen.getByRole("button", { name: "Approve" }))
    await screen.findByText(suggestion.receipt.informed, {}, { timeout: 3000 })

    await user.click(screen.getByRole("button", { name: "Reset demo" }))

    await waitFor(() => expect(ring()).toHaveAttribute("aria-valuenow", "0"))
    expect(screen.getByText(rules.autopilot.locked)).toBeInTheDocument()
    expect(lessonPrompt()).toBeInTheDocument()
  })
})

describe("regular preview (no demo session)", () => {
  it("keeps the history, the 3 lessons done and no lesson prompt", () => {
    renderWithDemo(<Overview />)

    expect(screen.getByText(trackRecord.missesTitle)).toBeInTheDocument()
    expect(screen.getByText(trackRecord.misses[0].label)).toBeInTheDocument()
    expect(ring()).toHaveAttribute("aria-valuenow", "3")
    expect(screen.queryByText(suggestion.lessonHint)).not.toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Good morning" })).toBeVisible()
  })

  it("opens the lesson instead of a coming-soon notice", async () => {
    const user = userEvent.setup()
    renderWithDemo(
      <>
        <Overview />
        <LessonLayer />
      </>,
    )

    await user.click(screen.getByRole("button", { name: "Start lesson" }))

    expect(
      await screen.findByRole("dialog", { name: concept.title }),
    ).toBeInTheDocument()
  })
})
