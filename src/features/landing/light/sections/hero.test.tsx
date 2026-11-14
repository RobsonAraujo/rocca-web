import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { hero } from "@/features/landing/content"

import { Hero } from "./hero"

vi.mock("@/features/waitlist/actions", () => ({ joinWaitlist: vi.fn() }))

describe("Light Hero", () => {
  it("renders the full headline with the emphasized part in italic", () => {
    render(<Hero />)

    const heading = screen.getByRole("heading", { level: 1, name: hero.title })
    expect(heading.querySelector("em")).toHaveTextContent(hero.emphasis)
  })

  it("renders the description, waitlist form and product preview", () => {
    render(<Hero />)

    expect(screen.getByText(hero.description)).toBeInTheDocument()
    expect(screen.getByLabelText("Email address")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Join the waitlist" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: /simulated preview/i }),
    ).toBeInTheDocument()
  })
})
