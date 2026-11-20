import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PORTFOLIO_PATH, PREVIEW_PATH } from "../constants"
import { ask, comingSoon, mobile } from "../data"
import { renderWithDemo } from "../test-utils"
import { AskSheet } from "./ask-sheet"
import { MobileTabBar } from "./tab-bar"

const nav = vi.hoisted(() => ({ pathname: "/preview" }))

vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }))
vi.mock("sonner", () => ({ toast: vi.fn() }))

function renderTabBar() {
  return renderWithDemo(
    <>
      <MobileTabBar />
      <AskSheet />
    </>,
  )
}

describe("MobileTabBar", () => {
  beforeEach(() => {
    nav.pathname = PREVIEW_PATH
  })

  it("links the built screens and marks the current one", () => {
    nav.pathname = PORTFOLIO_PATH
    renderTabBar()

    const bar = screen.getByRole("navigation", { name: mobile.tabs.label })
    expect(
      within(bar).getByRole("link", { name: mobile.tabs.portfolio }),
    ).toHaveAttribute("aria-current", "page")
    expect(
      within(bar).getByRole("link", { name: mobile.tabs.home }),
    ).toHaveAttribute("href", PREVIEW_PATH)
  })

  it("opens the Ask sheet from the center button", async () => {
    const user = userEvent.setup()
    renderTabBar()

    await user.click(screen.getByRole("button", { name: mobile.tabs.ask }))

    const sheet = await screen.findByRole("dialog")
    expect(within(sheet).getByLabelText(ask.inputLabel)).toBeInTheDocument()
  })

  it("shows the coming-soon notice for screens that aren't built", async () => {
    const user = userEvent.setup()
    renderTabBar()

    await user.click(screen.getByRole("button", { name: mobile.tabs.learn }))

    expect(toast).toHaveBeenCalledWith(
      comingSoon.title,
      expect.objectContaining({ description: comingSoon.description }),
    )
  })
})

describe("More menu", () => {
  it("opens every sidebar section from the More tab", async () => {
    const { MenuSheet } = await import("./menu-sheet")
    const user = userEvent.setup()
    render(
      <>
        <MobileTabBar />
        <MenuSheet />
      </>,
    )

    await user.click(screen.getByRole("button", { name: mobile.tabs.more }))

    const sheet = await screen.findByRole("dialog")
    expect(
      within(sheet).getByRole("link", { name: /Portfolio/ }),
    ).toHaveAttribute("href", PORTFOLIO_PATH)
    expect(
      within(sheet).getByRole("button", { name: /Settings/ }),
    ).toBeInTheDocument()
  })
})
