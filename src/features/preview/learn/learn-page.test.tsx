import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"

import { comingSoon } from "../data"
import { finishedSession, renderWithDemo } from "../test-utils"
import type { ConceptId } from "./data"
import { conceptById, concepts, learnPage, units } from "./data"
import { LearnPage } from "./learn-page"
import { LessonLayer } from "./lesson-layer"

vi.mock("sonner", () => ({ toast: vi.fn() }))

const { status } = learnPage
const node = (id: ConceptId, state: keyof typeof status) =>
  screen.getByRole("button", {
    name: `${conceptById(id).label}, ${status[state]}`,
  })
const stop = (id: string) => document.getElementById(id)!

function renderCourse(session = finishedSession) {
  return renderWithDemo(
    <>
      <LearnPage />
      <LessonLayer />
    </>,
    { session },
  )
}

describe("LearnPage", () => {
  it("says the course is built from the portfolio, and how", () => {
    renderCourse()

    expect(
      screen.getByRole("heading", { level: 1, name: "Maya's course" }),
    ).toBeInTheDocument()
    expect(screen.getByText(learnPage.badge)).toBeInTheDocument()
    const pipeline = screen.getByRole("list", {
      name: learnPage.pipeline.label,
    })
    for (const label of [
      learnPage.pipeline.accounts,
      learnPage.pipeline.holdings,
      learnPage.pipeline.lessons,
    ]) {
      expect(within(pipeline).getByText(label)).toBeInTheDocument()
    }
    expect(within(pipeline).getByText("12")).toBeInTheDocument()
  })

  it("lays the lessons out by unit, each tied to what you own", () => {
    renderCourse()

    for (const unit of units) {
      expect(
        screen.getByRole("heading", { name: unit.title }),
      ).toBeInTheDocument()
    }
    for (const concept of concepts) {
      const item = stop(concept.id)
      expect(within(item).getByText(concept.label)).toBeInTheDocument()
      expect(within(item).getByText(concept.source.label)).toBeInTheDocument()
      expect(within(item).getByText(concept.source.detail)).toBeInTheDocument()
    }
  })

  it("shows the game: level, XP, streak and badges", () => {
    renderCourse()

    const level = screen.getByRole("region", { name: "Level 1" })
    expect(within(level).getByText("Curious")).toBeInTheDocument()
    expect(within(level).getByText("0 XP")).toBeInTheDocument()
    expect(screen.getByText(learnPage.week.goal)).toBeInTheDocument()
    expect(
      screen.getByText(learnPage.achievements.count(1, 8)),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("img", {
        name: `${learnPage.trophy.label(1)}: ${learnPage.trophy.hint("Owns it")}`,
      }),
    ).toBeInTheDocument()
  })

  it("starts a new account at Concentration, with the rest ahead", () => {
    renderCourse()

    expect(node("concentration", "next")).toBeInTheDocument()
    expect(node("rebalancing", "notStarted")).toBeInTheDocument()
    expect(
      screen.getByRole("progressbar", { name: "Lessons completed" }),
    ).toHaveAttribute("aria-valuenow", "0")
    expect(
      screen.getByText(learnPage.rewards.locked("Concentration")),
    ).toBeInTheDocument()
  })

  it("shows what the regular preview already learned", () => {
    renderWithDemo(<LearnPage />)

    expect(
      screen.getByRole("heading", { level: 1, name: "Your course" }),
    ).toBeInTheDocument()
    for (const id of ["rebalancing", "expense-ratio", "roth-ira"] as const) {
      expect(node(id, "learned")).toBeInTheDocument()
    }
    expect(node("concentration", "next")).toBeInTheDocument()
  })

  it("opens a lesson card: where it comes from, what it unlocks, start", async () => {
    const user = userEvent.setup()
    renderCourse()
    const concentration = conceptById("concentration")

    await user.click(node("concentration", "next"))

    const card = await screen.findByRole("dialog", {
      name: concentration.title,
    })
    expect(within(card).getByText(concentration.tie)).toBeInTheDocument()
    expect(within(card).getByText(concentration.unlocks)).toBeInTheDocument()

    await user.click(
      within(card).getByRole("button", { name: learnPage.start }),
    )
    expect(
      await screen.findByRole("dialog", { name: concentration.title }),
    ).toHaveTextContent(/Step 1 of 5/)
  })

  it("keeps the lessons that aren't built as coming soon", async () => {
    const user = userEvent.setup()
    renderCourse()

    await user.click(node("tax-loss-harvesting", "notStarted"))
    const card = await screen.findByRole("dialog", {
      name: conceptById("tax-loss-harvesting").title,
    })
    await user.click(
      within(card).getByRole("button", { name: learnPage.start }),
    )

    expect(toast).toHaveBeenCalledWith(
      comingSoon.title,
      expect.objectContaining({ description: comingSoon.description }),
    )
  })
})
