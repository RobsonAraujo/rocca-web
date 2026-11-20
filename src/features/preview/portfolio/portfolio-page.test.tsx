import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"

import { illustrations, preview } from "@/features/landing/content"

import { PREVIEW_PATH } from "../constants"
import { accountAccess, comingSoon, mobile, suggestion } from "../data"
import {
  accountTotal,
  allocation,
  connectCopy,
  exposure,
  holdingGain,
  holdingValue,
  holdings,
  insightsCopy,
  page,
  portfolioTotal,
} from "./data"
import { PortfolioPage } from "./portfolio-page"

vi.mock("sonner", () => ({ toast: vi.fn() }))

const dollars = (text: string) => Number(text.replace(/[$,]/g, ""))

describe("portfolio data", () => {
  it("adds up to the same account totals the landing shows", () => {
    for (const { name, value } of illustrations.accounts) {
      expect(accountTotal(name)).toBe(dollars(value))
    }
  })

  it("matches the headline portfolio value", () => {
    expect(portfolioTotal).toBe(Math.floor(dollars(preview.portfolio.value)))
  })

  it("backs up the numbers quoted in the insights", () => {
    const share = (assetClass: string) =>
      allocation.find((a) => a.assetClass === assetClass)!.share
    const nvda = holdings.find((h) => h.symbol === "NVDA")!
    const losses = holdings
      .filter((h) => (h.gain ?? 0) < 0)
      .reduce((sum, h) => sum - holdingGain(h), 0)

    expect(Math.round(share("US stocks") * 100)).toBe(70)
    expect(Math.round(share("International") * 100)).toBe(9)
    expect(Math.round((holdingValue(nvda) / portfolioTotal) * 100)).toBe(18)
    expect(exposure.items[0]).toMatchObject({ symbol: "NVDA", direct: 0.18 })
    expect(Math.round(losses / 10) * 10).toBe(1240)
    expect(allocation.reduce((sum, a) => sum + a.share, 0)).toBeCloseTo(1)
  })
})

describe("PortfolioPage", () => {
  it("lets phones switch sections with the segmented control", async () => {
    const user = userEvent.setup()
    const { container } = render(<PortfolioPage />)
    const holdingsButton = screen.getByRole("button", {
      name: mobile.portfolioViews.holdings,
    })

    expect(container.querySelector("[data-view]")).toHaveAttribute(
      "data-view",
      "overview",
    )
    await user.click(holdingsButton)

    expect(holdingsButton).toHaveAttribute("aria-pressed", "true")
    expect(container.querySelector("[data-view]")).toHaveAttribute(
      "data-view",
      "holdings",
    )
  })

  it("renders every section and one row per holding", () => {
    render(<PortfolioPage />)

    expect(
      screen.getByRole("heading", { level: 1, name: page.title }),
    ).toBeInTheDocument()
    for (const title of [
      "Allocation",
      exposure.title,
      insightsCopy.title,
      "Accounts",
      "Holdings",
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument()
    }

    const table = screen.getByRole("table")
    // +1 for the header row.
    expect(within(table).getAllByRole("row")).toHaveLength(holdings.length + 1)
  })

  it("links the concentration insight to the suggestion on the overview", () => {
    render(<PortfolioPage />)

    expect(
      screen.getByRole("link", { name: /See Rocca's suggestion/ }),
    ).toHaveAttribute("href", `${PREVIEW_PATH}#suggestion`)
  })

  it("shows each account's broker and what Rocca can do there", () => {
    const { container } = render(<PortfolioPage />)
    const accounts = within(container.querySelector<HTMLElement>("#accounts")!)

    for (const { institution, access } of illustrations.accounts) {
      expect(accounts.getByText(institution)).toBeInTheDocument()
      expect(
        accounts.getAllByText(accountAccess[access]).length,
      ).toBeGreaterThan(0)
    }
  })

  it("opens the connect sheet, split by what each broker allows", async () => {
    const user = userEvent.setup()
    render(<PortfolioPage />)

    // Header (desktop) and Accounts (phones) both open the same sheet.
    await user.click(screen.getAllByRole("button", { name: page.connect })[0]!)

    const sheet = await screen.findByRole("dialog")
    for (const group of connectCopy.groups) {
      expect(
        within(sheet).getByRole("heading", { name: group.title }),
      ).toBeInTheDocument()
    }

    await user.click(within(sheet).getByRole("button", { name: /Fidelity/ }))

    expect(toast).toHaveBeenCalledWith(
      comingSoon.title,
      expect.objectContaining({ description: comingSoon.description }),
    )
  })
})

describe("broker access in the demo", () => {
  it("places the suggested trade in an account whose broker allows trading", () => {
    const account = illustrations.accounts.find(
      (a) => a.name === preview.order.taxSmart.account,
    )

    expect(account?.access).toBe("trade")
    expect(suggestion.placing).toContain(account!.institution)
  })

  it("lists every demo account's broker in the matching connect group", () => {
    for (const { institution, access } of illustrations.accounts) {
      const group = connectCopy.groups.find((g) => g.access === access)!
      expect(group.institutions).toContain(institution)
    }
  })
})
