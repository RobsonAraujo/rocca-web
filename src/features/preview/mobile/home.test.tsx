import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"

import {
  autonomy,
  comingSoon,
  learn,
  mobile,
  portfolio,
  savings,
  suggestion,
} from "../data"
import { MobileHome } from "./home"

vi.mock("sonner", () => ({ toast: vi.fn() }))

describe("MobileHome", () => {
  it("leads with the balance, then the decision that needs you", () => {
    render(<MobileHome />)

    expect(screen.getByText(portfolio.value)).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: suggestion.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(learn.next.title)).toBeInTheDocument()
    expect(screen.getByText(savings.total)).toBeInTheDocument()
  })

  it("answers Approve with the coming-soon notice", async () => {
    const user = userEvent.setup()
    render(<MobileHome />)

    await user.click(screen.getByRole("button", { name: "Approve" }))

    expect(toast).toHaveBeenCalledWith(
      comingSoon.title,
      expect.objectContaining({ description: comingSoon.description }),
    )
  })

  it("opens the reasoning in a sheet from Why?", async () => {
    const user = userEvent.setup()
    render(<MobileHome />)

    await user.click(screen.getByRole("button", { name: mobile.decision.why }))

    const sheet = await screen.findByRole("dialog")
    expect(
      within(sheet).getByText(mobile.decision.whyTitle),
    ).toBeInTheDocument()
    expect(
      within(sheet).getByText(suggestion.reasoning[0]!.text),
    ).toBeInTheDocument()
  })

  it("opens the controls sheet from the Mode row", async () => {
    const user = userEvent.setup()
    render(<MobileHome />)

    await user.click(screen.getByRole("button", { name: /Mode/ }))

    const sheet = await screen.findByRole("dialog")
    expect(within(sheet).getByText(autonomy.title)).toBeInTheDocument()
  })
})
