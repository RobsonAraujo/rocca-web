import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { parseWelcome } from "./components/welcome-banner"
import { PORTFOLIO_PATH } from "./constants"
import {
  ask,
  autonomy,
  comingSoon,
  demo,
  learn,
  moves,
  portfolio,
  rules,
  savings,
  suggestion,
  trackRecord,
} from "./data"
import { Overview } from "./overview"
import { renderWithDemo } from "./test-utils"

// vi.mock is hoisted above imports, so shared state must use vi.hoisted.
const search = vi.hoisted(() => ({ params: new URLSearchParams() }))

vi.mock("next/navigation", () => ({ useSearchParams: () => search.params }))
vi.mock("sonner", () => ({ toast: vi.fn() }))

const expectComingSoon = () =>
  expect(toast).toHaveBeenCalledWith(
    comingSoon.title,
    expect.objectContaining({ description: comingSoon.description }),
  )

describe("Overview", () => {
  beforeEach(() => {
    search.params = new URLSearchParams()
  })

  it("shows every module, including the differentiators", () => {
    renderWithDemo(<Overview />)

    for (const title of [
      portfolio.title,
      suggestion.title,
      autonomy.title,
      rules.title,
      learn.title,
      moves.title,
      savings.title,
      trackRecord.title,
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument()
    }
    expect(screen.getByText(suggestion.taxSmart.estimate)).toBeInTheDocument()
    expect(screen.getByText(trackRecord.missesTitle)).toBeInTheDocument()
  })

  it("switches the chart range", async () => {
    const user = userEvent.setup()
    renderWithDemo(<Overview />)
    expect(
      screen.getByRole("button", { name: "1M", pressed: true }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "1W" }))

    expect(
      screen.getByText(portfolio.chart.series["1W"].caption),
    ).toBeInTheDocument()
    expect(screen.getByText("+1.8%")).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: /past week: \+1\.8%/ }),
    ).toBeInTheDocument()
  })

  it("links to the full portfolio page", () => {
    renderWithDemo(<Overview />)

    expect(
      screen.getByRole("link", { name: portfolio.viewAll }),
    ).toHaveAttribute("href", PORTFOLIO_PATH)
  })

  it("simulates approving the suggestion, then lets you replay it", async () => {
    const user = userEvent.setup()
    renderWithDemo(<Overview />)
    expect(screen.getByText(rules.attentionCount)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Approve" }))
    expect(screen.getByText(suggestion.placing)).toBeInTheDocument()

    expect(
      await screen.findByText(suggestion.receipt.title, {}, { timeout: 3000 }),
    ).toBeInTheDocument()
    expect(screen.getByText(demo.waitlistNote)).toBeInTheDocument()
    // The 12% rule is back on track.
    expect(screen.getByText(rules.allClear)).toBeInTheDocument()
    expect(screen.getByText(/NVDA is back at 12%/)).toBeInTheDocument()
    expect(toast).not.toHaveBeenCalled()

    await user.click(screen.getByRole("button", { name: demo.reset }))
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument()
    expect(screen.getByText(rules.attentionCount)).toBeInTheDocument()
  })

  it("skips the suggestion with Not now", async () => {
    const user = userEvent.setup()
    renderWithDemo(<Overview />)

    await user.click(screen.getByRole("button", { name: "Not now" }))

    expect(screen.getByText(suggestion.skipped.title)).toBeInTheDocument()
    expect(screen.getByText(rules.attentionCount)).toBeInTheDocument()
  })

  it("switches the autonomy mode across the page", async () => {
    const user = userEvent.setup()
    renderWithDemo(<Overview />)
    expect(screen.getByText(`Mode: Suggest, I approve`)).toBeInTheDocument()

    await user.click(
      screen.getByRole("button", { name: `${autonomy.change} Autopilot` }),
    )

    expect(screen.getByText("Mode: Autopilot")).toBeInTheDocument()
    expect(
      screen.getByText(autonomy.inThisMode.byLevel.autopilot.rocca[0]!),
    ).toBeInTheDocument()
    expect(screen.getByText(suggestion.autopilotNote)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Autopilot", pressed: true }),
    ).toBeInTheDocument()
  })

  it("keeps the coming-soon notice for what needs the real product", async () => {
    const user = userEvent.setup()
    renderWithDemo(<Overview />)

    await user.click(screen.getByRole("button", { name: rules.add }))
    expectComingSoon()
  })
})

describe("Ask Rocca composer", () => {
  it("keeps Send disabled until there is a question", async () => {
    const user = userEvent.setup()
    renderWithDemo(<Overview />)
    const send = screen.getByRole("button", { name: ask.submit })

    expect(send).toBeDisabled()
    await user.type(screen.getByLabelText(ask.inputLabel), "Am I diversified?")
    expect(send).toBeEnabled()
  })

  it("answers a suggested question with its canned answer", async () => {
    const user = userEvent.setup()
    renderWithDemo(<Overview />)
    const question = ask.suggestions[1]

    await user.click(screen.getByRole("button", { name: question }))
    await user.click(screen.getByRole("button", { name: ask.submit }))

    expect(screen.getByText(ask.thinking)).toBeInTheDocument()
    expect(await screen.findByText(ask.answers[question]!)).toBeInTheDocument()
    expect(screen.getByLabelText(ask.inputLabel)).toHaveValue("")
    expect(toast).not.toHaveBeenCalled()
  })

  it("sends with Enter, breaks lines with Shift+Enter, and falls back for free questions", async () => {
    const user = userEvent.setup()
    renderWithDemo(<Overview />)
    const box = screen.getByLabelText(ask.inputLabel)

    await user.type(box, "First line{Shift>}{Enter}{/Shift}second line")
    expect(box).toHaveValue("First line\nsecond line")
    expect(screen.queryByText(ask.thinking)).not.toBeInTheDocument()

    await user.type(box, "{Enter}")
    expect(await screen.findByText(ask.fallback)).toBeInTheDocument()
    expect(screen.getByText(demo.waitlistNote)).toBeInTheDocument()
  })

  it("fills the box when a suggestion is picked", async () => {
    const user = userEvent.setup()
    renderWithDemo(<Overview />)
    const [first] = ask.suggestions

    await user.click(screen.getByRole("button", { name: first }))

    expect(screen.getByLabelText(ask.inputLabel)).toHaveValue(first)
    expect(screen.getByLabelText(ask.inputLabel)).toHaveFocus()
    expect(toast).not.toHaveBeenCalled()
  })
})

describe("parseWelcome", () => {
  it("accepts only the values the waitlist form sets", () => {
    expect(parseWelcome("new")).toBe("new")
    expect(parseWelcome("back")).toBe("back")
    expect(parseWelcome("anything")).toBeNull()
    expect(parseWelcome(null)).toBeNull()
  })
})
