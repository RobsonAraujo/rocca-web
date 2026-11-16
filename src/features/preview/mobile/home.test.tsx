import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"

import {
  autonomy,
  demo,
  learn,
  mobile,
  portfolio,
  savings,
  suggestion,
} from "../data"
import { MobileHome } from "./home"
import { renderWithDemo } from "../test-utils"

vi.mock("sonner", () => ({ toast: vi.fn() }))

describe("MobileHome", () => {
  it("leads with the balance, then the decision that needs you", () => {
    renderWithDemo(<MobileHome />)

    expect(screen.getByText(portfolio.value)).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: suggestion.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(learn.next.title)).toBeInTheDocument()
    expect(screen.getByText(savings.total)).toBeInTheDocument()
  })

  it("simulates Approve with a receipt and a reset", async () => {
    const user = userEvent.setup()
    renderWithDemo(<MobileHome />)

    await user.click(screen.getByRole("button", { name: "Approve" }))

    expect(
      await screen.findByText(suggestion.receipt.title, {}, { timeout: 3000 }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/needs attention/)).not.toBeInTheDocument()
    expect(toast).not.toHaveBeenCalled()

    await user.click(screen.getByRole("button", { name: demo.reset }))
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument()
  })

  it("opens the reasoning in a sheet from Why?", async () => {
    const user = userEvent.setup()
    renderWithDemo(<MobileHome />)

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
    renderWithDemo(<MobileHome />)

    await user.click(screen.getByRole("button", { name: /Mode/ }))

    const sheet = await screen.findByRole("dialog")
    expect(within(sheet).getByText(autonomy.title)).toBeInTheDocument()
  })
})
