import { fireEvent, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { parseWelcome } from "./components/welcome-banner"
import { PORTFOLIO_PATH } from "./constants"
import {
  autonomy,
  comingSoon,
  demo,
  learn,
  moves,
  portfolio,
  rules,
  savings,
  status,
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

  it("shows the value at the point under the pointer while scrubbing", () => {
    renderWithDemo(<Overview />)
    const chart = screen.getByRole("img", { name: /^Portfolio value/ })
    vi.spyOn(chart, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ x: 0, y: 0, width: 280, height: 200 }),
    )
    expect(screen.getByText(portfolio.value)).toBeInTheDocument()

    // The left edge is the first close of the month.
    fireEvent.pointerMove(chart, { clientX: 0 })
    expect(screen.getByText("$240,120")).toBeInTheDocument()
    expect(screen.getByText("28 days ago")).toBeInTheDocument()

    fireEvent.pointerLeave(chart)
    expect(screen.getByText(portfolio.value)).toBeInTheDocument()
    expect(
      screen.getByText(portfolio.chart.series["1M"].caption),
    ).toBeInTheDocument()
  })

  it("compares the portfolio with the S&P 500", async () => {
    const user = userEvent.setup()
    renderWithDemo(<Overview />)
    const toggle = screen.getByRole("button", {
      name: portfolio.chart.benchmark.toggle,
    })

    await user.click(toggle)

    expect(toggle).toHaveAttribute("aria-pressed", "true")
    expect(
      screen.getByRole("img", { name: /S&P 500: \+2\.1%/ }),
    ).toBeInTheDocument()
    expect(screen.getByText(/S&P 500 \(simulated\)/)).toBeInTheDocument()
  })

  it("opens the reasoning, with its sources, in a side panel", async () => {
    const user = userEvent.setup()
    renderWithDemo(<Overview />)

    await user.click(screen.getByRole("button", { name: suggestion.review }))

    const panel = await screen.findByRole("dialog", {
      name: suggestion.reviewTitle,
    })
    for (const step of suggestion.reasoning) {
      expect(within(panel).getByText(step.text)).toBeInTheDocument()
    }
    expect(
      within(panel).getByText(suggestion.next.steps[0]),
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
    expect(screen.getByText(status.waiting)).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: /from 18% to 12%/ }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Approve" }))
    expect(screen.getByText(suggestion.placing)).toBeInTheDocument()

    expect(
      await screen.findByText(suggestion.receipt.title, {}, { timeout: 3000 }),
    ).toBeInTheDocument()
    expect(screen.getByText(demo.waitlistNote)).toBeInTheDocument()
    // The 12% rule is back on track, and nothing waits on you.
    expect(screen.getByText(rules.allClear)).toBeInTheDocument()
    expect(screen.getByText(status.clear)).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: /: 12%, within/ }),
    ).toBeInTheDocument()
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

describe("parseWelcome", () => {
  it("accepts only the values the waitlist form sets", () => {
    expect(parseWelcome("new")).toBe("new")
    expect(parseWelcome("back")).toBe("back")
    expect(parseWelcome("anything")).toBeNull()
    expect(parseWelcome(null)).toBeNull()
  })
})
