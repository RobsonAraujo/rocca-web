import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { footer } from "@/features/landing/content"

import { PORTFOLIO_PATH, PREVIEW_PATH } from "./constants"
import { comingSoon, shell } from "./data"
import { PreviewShell } from "./shell"

const nav = vi.hoisted(() => ({ pathname: "/preview" }))

vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }))
vi.mock("sonner", () => ({ toast: vi.fn(), Toaster: () => null }))

describe("PreviewShell", () => {
  beforeEach(() => {
    nav.pathname = PREVIEW_PATH
  })

  it("renders the page with the legal disclaimer", () => {
    render(<PreviewShell>page content</PreviewShell>)

    expect(screen.getByText("page content")).toBeInTheDocument()
    expect(screen.getByText(footer.disclaimer)).toBeInTheDocument()
  })

  it("marks the current page in every nav (sidebar, tablet bar, phone tab bar)", () => {
    nav.pathname = PORTFOLIO_PATH
    render(<PreviewShell>page</PreviewShell>)

    const portfolioLinks = screen.getAllByRole("link", { name: "Portfolio" })
    expect(portfolioLinks).toHaveLength(3)
    for (const link of portfolioLinks) {
      expect(link).toHaveAttribute("href", PORTFOLIO_PATH)
      expect(link).toHaveAttribute("aria-current", "page")
    }
    for (const link of screen.getAllByRole("link", { name: "Overview" })) {
      expect(link).not.toHaveAttribute("aria-current")
    }
  })

  it("collapses the sidebar to icons and expands it again", async () => {
    const user = userEvent.setup()
    render(<PreviewShell>page</PreviewShell>)
    const sidebar = screen.getByRole("complementary")
    expect(sidebar).toHaveAttribute("data-state", "expanded")

    await user.click(
      within(sidebar).getByRole("button", { name: shell.collapseMenu }),
    )

    expect(sidebar).toHaveAttribute("data-state", "collapsed")
    // Icons only on screen, but every item keeps its name.
    expect(
      within(sidebar).getByRole("link", { name: "Portfolio" }),
    ).toHaveAttribute("href", PORTFOLIO_PATH)
    expect(
      within(sidebar).getByRole("button", { name: "Agent" }),
    ).toBeInTheDocument()
    expect(
      within(sidebar).getByRole("link", { name: shell.backToSite }),
    ).toBeInTheDocument()

    await user.click(
      within(sidebar).getByRole("button", { name: shell.expandMenu }),
    )

    expect(sidebar).toHaveAttribute("data-state", "expanded")
  })

  it("names a collapsed item in a tooltip", async () => {
    const user = userEvent.setup()
    render(<PreviewShell>page</PreviewShell>)
    const sidebar = screen.getByRole("complementary")
    await user.click(
      within(sidebar).getByRole("button", { name: shell.collapseMenu }),
    )

    await user.hover(within(sidebar).getByRole("link", { name: "Portfolio" }))

    expect(
      await screen.findByText("Portfolio", {
        selector: "[data-slot=tooltip-content]",
      }),
    ).toBeInTheDocument()
  })

  it("shows the coming-soon notice for sections that aren't built", async () => {
    const user = userEvent.setup()
    render(<PreviewShell>page</PreviewShell>)

    const [agent] = screen.getAllByRole("button", { name: "Agent" })
    await user.click(agent!)

    expect(toast).toHaveBeenCalledWith(
      comingSoon.title,
      expect.objectContaining({ description: comingSoon.description }),
    )
  })
})
