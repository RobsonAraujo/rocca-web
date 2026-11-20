import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Delta, directionOf } from "./delta"

describe("Delta", () => {
  it("reads the direction from the sign", () => {
    expect(directionOf("+$4,390")).toBe("up")
    expect(directionOf("−$320")).toBe("down")
    expect(directionOf("-0.4%")).toBe("down")
    expect(directionOf("$0")).toBe("flat")
  })

  it("keeps the sign in the text and adds an arrow, not just a color", () => {
    const { container } = render(<Delta value="−$320" />)

    expect(screen.getByText("−$320")).toBeInTheDocument()
    const delta = container.firstElementChild!
    expect(delta).toHaveAttribute("data-direction", "down")
    expect(delta).toHaveClass("text-destructive")
    expect(delta.querySelector("svg")).toBeInTheDocument()
  })

  it("shows gains in the brand color and flat values without an arrow", () => {
    const { container, rerender } = render(<Delta value="+1.8%" />)
    expect(container.firstElementChild).toHaveClass("text-brand")

    rerender(<Delta value="0.0%" />)
    expect(container.firstElementChild).toHaveClass("text-muted-foreground")
    expect(container.querySelector("svg")).not.toBeInTheDocument()
  })
})
