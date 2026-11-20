import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ask, demo, suggestion } from "../data"
import { renderWithDemo } from "../test-utils"
import { AskPage } from "./ask-page"
import { answerFor, answerLength } from "./chat-state"

vi.mock("sonner", () => ({ toast: vi.fn() }))

/** jsdom has no matchMedia: stub it, with or without reduced motion. */
function reducedMotion(matches: boolean) {
  vi.stubGlobal("matchMedia", (media: string) => ({
    matches,
    media,
    addEventListener() {},
    removeEventListener() {},
  }))
}

const log = () => screen.getByRole("log", { name: ask.conversation })

describe("answerFor", () => {
  it("finds the script for a question, its aliases and loose spellings", () => {
    expect(answerFor("Am I diversified enough?").fallback).toBe(false)
    expect(answerFor("  am i diversified enough  ").fallback).toBe(false)
    expect(answerFor(ask.askWhy).blocks).toEqual(
      answerFor("What should I do about NVDA?").blocks,
    )
  })

  it("falls back for anything else, offering the starters", () => {
    const answer = answerFor("How are bonds doing?")
    expect(answer.fallback).toBe(true)
    expect(answer.followUps).toEqual(ask.suggestions)
  })

  it("only suggests follow-ups the preview can answer", () => {
    for (const script of ask.scripts) {
      for (const question of script.followUps) {
        expect(answerFor(question).fallback).toBe(false)
      }
      expect(answerLength(answerFor(script.question))).toBeGreaterThan(0)
    }
  })
})

describe("Ask Rocca chat", () => {
  beforeEach(() => reducedMotion(true))
  afterEach(() => vi.unstubAllGlobals())

  it("opens ChatGPT-style: a question, the composer and starters", () => {
    renderWithDemo(<AskPage />)

    expect(
      screen.getByRole("heading", { level: 1, name: ask.greeting }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(ask.inputLabel)).toBeInTheDocument()
    for (const question of ask.suggestions) {
      expect(screen.getByRole("button", { name: question })).toBeInTheDocument()
    }
    expect(screen.getByText(ask.disclaimer)).toBeInTheDocument()
  })

  it("keeps Send disabled until there is a question", async () => {
    const user = userEvent.setup()
    renderWithDemo(<AskPage />)
    const send = screen.getByRole("button", { name: ask.submit })

    expect(send).toBeDisabled()
    await user.type(screen.getByLabelText(ask.inputLabel), "Am I diversified?")
    expect(send).toBeEnabled()
  })

  it("answers a starter with text, a live component, sources and follow-ups", async () => {
    const user = userEvent.setup()
    renderWithDemo(<AskPage />)

    await user.click(
      screen.getByRole("button", { name: "Why did my portfolio go up?" }),
    )

    const thread = within(log())
    expect(thread.getByText("Why did my portfolio go up?")).toBeInTheDocument()
    expect(
      thread.getByText(/It added \$3,120 of your \$4,390 gain/),
    ).toBeInTheDocument()
    expect(thread.getByText(ask.blocks.movers)).toBeInTheDocument()
    expect(thread.getByText("Market data")).toBeInTheDocument()

    // A follow-up asks the next question.
    await user.click(
      thread.getByRole("button", { name: "What should I do about NVDA?" }),
    )
    expect(thread.getByText(ask.blocks.trade)).toBeInTheDocument()
  })

  it("lets you approve the trade right in the chat", async () => {
    const user = userEvent.setup()
    renderWithDemo(<AskPage />)

    await user.click(
      screen.getByRole("button", { name: "What should I do about NVDA?" }),
    )
    await user.click(within(log()).getByRole("button", { name: "Approve" }))

    expect(
      await screen.findByText(suggestion.receipt.title, {}, { timeout: 3000 }),
    ).toBeInTheDocument()
  })

  it("sends with Enter, breaks lines with Shift+Enter, and falls back for free questions", async () => {
    const user = userEvent.setup()
    renderWithDemo(<AskPage />)
    const box = screen.getByLabelText(ask.inputLabel)

    await user.type(box, "First line{Shift>}{Enter}{/Shift}second line")
    expect(box).toHaveValue("First line\nsecond line")

    await user.type(box, "{Enter}")
    expect(
      within(log()).getByText(/it knows the questions below/),
    ).toBeInTheDocument()
    expect(screen.getByText(demo.waitlistNote)).toBeInTheDocument()
    expect(screen.getByLabelText(ask.inputLabel)).toHaveValue("")
  })

  it("rates an answer, answers again, and starts a new chat", async () => {
    const user = userEvent.setup()
    renderWithDemo(<AskPage />)
    await user.click(screen.getByRole("button", { name: "What's a Roth IRA?" }))

    const good = within(log()).getByRole("button", { name: ask.actions.good })
    await user.click(good)
    expect(good).toHaveAttribute("aria-pressed", "true")

    await user.click(
      within(log()).getByRole("button", { name: ask.actions.retry }),
    )
    expect(within(log()).getByText(ask.blocks.account)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: ask.newChat }))
    expect(
      screen.getByRole("heading", { level: 1, name: ask.greeting }),
    ).toBeInTheDocument()
  })
})

describe("Ask Rocca typing", () => {
  beforeEach(() => reducedMotion(false))
  afterEach(() => vi.unstubAllGlobals())

  it("thinks, types the answer out, and can be stopped", async () => {
    const user = userEvent.setup()
    renderWithDemo(<AskPage />)

    await user.click(
      screen.getByRole("button", { name: "Am I diversified enough?" }),
    )

    expect(within(log()).getByText(ask.thinking)).toBeInTheDocument()
    expect(log()).toHaveAttribute("aria-busy", "true")

    await user.click(screen.getByRole("button", { name: ask.stop }))

    expect(log()).toHaveAttribute("aria-busy", "false")
    expect(
      within(log()).getByText(/Everything else is spread across/),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: ask.submit })).toBeInTheDocument()
  })

  it("finishes typing on its own", async () => {
    const user = userEvent.setup()
    renderWithDemo(<AskPage />)

    await user.click(
      screen.getByRole("button", { name: "Why did my portfolio go up?" }),
    )

    expect(
      await within(log()).findByRole(
        "button",
        { name: ask.actions.retry },
        { timeout: 4000 },
      ),
    ).toBeInTheDocument()
    expect(
      within(log()).getByText(/That's why a suggestion is waiting for you/),
    ).toBeInTheDocument()
  })
})
