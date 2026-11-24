import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { LEARN_PATH, PORTFOLIO_PATH, PREVIEW_PATH } from "../constants"
import { ask, mobile } from "../data"
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

  it("links the Learn course", () => {
    nav.pathname = LEARN_PATH
    renderTabBar()

    const bar = screen.getByRole("navigation", { name: mobile.tabs.label })
    const learn = within(bar).getByRole("link", { name: mobile.tabs.learn })
    expect(learn).toHaveAttribute("href", LEARN_PATH)
    expect(learn).toHaveAttribute("aria-current", "page")
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
