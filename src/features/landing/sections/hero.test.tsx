import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { demoCta, hero } from "@/features/landing/content"
import { DEMO_PATH } from "@/features/preview/constants"

import { Hero } from "./hero"

vi.mock("@/features/waitlist/actions", () => ({ joinWaitlist: vi.fn() }))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }),
}))

describe("Hero", () => {
  it("renders the full headline with the emphasized part highlighted, not italic", () => {
    render(<Hero />)

    const heading = screen.getByRole("heading", { level: 1, name: hero.title })
    const highlight = heading.querySelector('[data-slot="hero-emphasis"]')
    expect(highlight).toHaveTextContent(hero.emphasis)
    expect(heading.querySelector("em, i")).toBeNull()
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

  it("offers the demo to visitors who want to look before joining", () => {
    render(<Hero />)

    expect(screen.getByRole("link", { name: demoCta.label })).toHaveAttribute(
      "href",
      DEMO_PATH,
    )
  })
})
