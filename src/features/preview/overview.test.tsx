import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { parseWelcome } from "./components/welcome-banner"
import { PORTFOLIO_PATH } from "./constants"
import {
  ask,
  autonomy,
  comingSoon,
  learn,
  moves,
  portfolio,
  rules,
  savings,
  suggestion,
  trackRecord,
  welcome,
} from "./data"
import { Overview } from "./overview"

// vi.mock is hoisted above imports, so shared state must use vi.hoisted.
const search = vi.hoisted(() => ({ params: new URLSearchParams() }))

vi.mock("next/navigation", () => ({ useSearchParams: () => search.params }))
vi.mock("sonner", () => ({ toast: vi.fn() }))

const expectComingSoon = () =>
  expect(toast).toHaveBeenCalledWith(
    comingSoon.title,
    expect.objectContaining({ description: comingSoon.description }),
  )

describe("Overview", () => {
  beforeEach(() => {
    search.params = new URLSearchParams()
  })

  it("shows every module, including the differentiators", () => {
    render(<Overview />)

    for (const title of [
      portfolio.title,
      suggestion.title,
      autonomy.title,
      rules.title,
      learn.title,
      moves.title,
      savings.title,
      trackRecord.title,
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument()
    }
    expect(screen.getByText(suggestion.taxSmart.estimate)).toBeInTheDocument()
    expect(screen.getByText(trackRecord.missesTitle)).toBeInTheDocument()
  })

  it("links to the full portfolio page", () => {
    render(<Overview />)

    expect(
      screen.getByRole("link", { name: portfolio.viewAll }),
    ).toHaveAttribute("href", PORTFOLIO_PATH)
  })

  it("answers actions with the coming-soon notice", async () => {
    const user = userEvent.setup()
    render(<Overview />)

    await user.click(screen.getByRole("button", { name: "Approve" }))
    expectComingSoon()

    await user.click(screen.getByRole("button", { name: rules.add }))
    expect(toast).toHaveBeenCalledTimes(2)
  })

  it("greets people arriving from the waitlist and can be dismissed", async () => {
    search.params = new URLSearchParams("welcome=new")
    const user = userEvent.setup()
    render(<Overview />)

    expect(screen.getByRole("status")).toHaveTextContent(welcome.new.title)

    await user.click(screen.getByRole("button", { name: welcome.dismiss }))
    expect(screen.queryByText(welcome.new.title)).not.toBeInTheDocument()
  })

  it("shows no greeting when opened directly", () => {
    render(<Overview />)

    expect(screen.queryByText(welcome.new.title)).not.toBeInTheDocument()
    expect(screen.queryByText(welcome.back.title)).not.toBeInTheDocument()
  })
})

describe("Ask Rocca composer", () => {
  it("keeps Send disabled until there is a question", async () => {
    const user = userEvent.setup()
    render(<Overview />)
    const send = screen.getByRole("button", { name: ask.submit })

    expect(send).toBeDisabled()
    await user.type(screen.getByLabelText(ask.inputLabel), "Am I diversified?")
    expect(send).toBeEnabled()

    await user.click(send)
    expectComingSoon()
  })

  it("sends with Enter and adds a new line with Shift+Enter", async () => {
    const user = userEvent.setup()
    render(<Overview />)
    const box = screen.getByLabelText(ask.inputLabel)

    await user.type(box, "First line{Shift>}{Enter}{/Shift}second line")
    expect(box).toHaveValue("First line\nsecond line")
    expect(toast).not.toHaveBeenCalled()

    await user.type(box, "{Enter}")
    expectComingSoon()
  })

  it("fills the box when a suggestion is picked", async () => {
    const user = userEvent.setup()
    render(<Overview />)
    const [first] = ask.suggestions

    await user.click(screen.getByRole("button", { name: first }))

    expect(screen.getByLabelText(ask.inputLabel)).toHaveValue(first)
    expect(screen.getByLabelText(ask.inputLabel)).toHaveFocus()
    expect(toast).not.toHaveBeenCalled()
  })
})

describe("parseWelcome", () => {
  it("accepts only the values the waitlist form sets", () => {
    expect(parseWelcome("new")).toBe("new")
    expect(parseWelcome("back")).toBe("back")
    expect(parseWelcome("anything")).toBeNull()
    expect(parseWelcome(null)).toBeNull()
  })
})
