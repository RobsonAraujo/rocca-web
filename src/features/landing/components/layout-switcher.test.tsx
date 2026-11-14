import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { LayoutSwitcher } from "./layout-switcher"

describe("LayoutSwitcher", () => {
  it("links to both layout versions", () => {
    render(<LayoutSwitcher current="light" />)

    const nav = screen.getByRole("navigation", { name: "Layout versions" })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Light" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(screen.getByRole("link", { name: "Dark" })).toHaveAttribute(
      "href",
      "/dark",
    )
  })

  it.each(["light", "dark"] as const)(
    "marks %s as the current version",
    (current) => {
      render(<LayoutSwitcher current={current} />)

      const label = current === "light" ? "Light" : "Dark"
      const other = current === "light" ? "Dark" : "Light"
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "aria-current",
        "page",
      )
      expect(screen.getByRole("link", { name: other })).not.toHaveAttribute(
        "aria-current",
      )
    },
  )
})
