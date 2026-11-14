import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { hero } from "@/features/landing/content"
import { Hero } from "./hero"

vi.mock("@/features/waitlist/actions", () => ({ joinWaitlist: vi.fn() }))

describe("Hero", () => {
  it("renders the headline, description and waitlist form", () => {
    render(<Hero />)

    expect(
      screen.getByRole("heading", { level: 1, name: hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(hero.description)).toBeInTheDocument()
    expect(screen.getByLabelText("Email address")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Join the waitlist" }),
    ).toBeInTheDocument()
  })
})
