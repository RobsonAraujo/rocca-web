import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"

import { ask, demo } from "../data"
import { AskComposer } from "./ask-rocca"

vi.mock("sonner", () => ({ toast: vi.fn() }))

describe("Ask Rocca composer", () => {
  it("keeps Send disabled until there is a question", async () => {
    const user = userEvent.setup()
    render(<AskComposer />)
    const send = screen.getByRole("button", { name: ask.submit })

    expect(send).toBeDisabled()
    await user.type(screen.getByLabelText(ask.inputLabel), "Am I diversified?")
    expect(send).toBeEnabled()
  })

  it("answers a suggested question with its canned answer", async () => {
    const user = userEvent.setup()
    render(<AskComposer />)
    const question = ask.suggestions[1]

    await user.click(screen.getByRole("button", { name: question }))
    await user.click(screen.getByRole("button", { name: ask.submit }))

    expect(screen.getByText(ask.thinking)).toBeInTheDocument()
    expect(await screen.findByText(ask.answers[question]!)).toBeInTheDocument()
    expect(screen.getByLabelText(ask.inputLabel)).toHaveValue("")
    expect(toast).not.toHaveBeenCalled()
  })

  it("sends with Enter, breaks lines with Shift+Enter, and falls back for free questions", async () => {
    const user = userEvent.setup()
    render(<AskComposer />)
    const box = screen.getByLabelText(ask.inputLabel)

    await user.type(box, "First line{Shift>}{Enter}{/Shift}second line")
    expect(box).toHaveValue("First line\nsecond line")
    expect(screen.queryByText(ask.thinking)).not.toBeInTheDocument()

    await user.type(box, "{Enter}")
    expect(await screen.findByText(ask.fallback)).toBeInTheDocument()
    expect(screen.getByText(demo.waitlistNote)).toBeInTheDocument()
  })

  it("fills the box when a suggestion is picked", async () => {
    const user = userEvent.setup()
    render(<AskComposer />)
    const [first] = ask.suggestions

    await user.click(screen.getByRole("button", { name: first }))

    expect(screen.getByLabelText(ask.inputLabel)).toHaveValue(first)
    expect(screen.getByLabelText(ask.inputLabel)).toHaveFocus()
    expect(toast).not.toHaveBeenCalled()
  })
})
