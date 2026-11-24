import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"

import { comingSoon } from "../data"
import { finishedSession, renderWithDemo } from "../test-utils"
import { concepts, learnPage } from "./data"
import { LearnPage } from "./learn-page"
import { LessonLayer } from "./lesson-layer"

vi.mock("sonner", () => ({ toast: vi.fn() }))

const card = (id: string) => document.getElementById(id)!

describe("LearnPage", () => {
  it("builds the course from the portfolio: each concept, its tie and unlock", () => {
    renderWithDemo(<LearnPage />, { session: finishedSession })

    for (const concept of concepts) {
      const article = card(concept.id)
      expect(
        within(article).getByRole("heading", { name: concept.title }),
      ).toBeInTheDocument()
      expect(within(article).getByText(concept.tie)).toBeInTheDocument()
      expect(within(article).getByText(concept.unlocks)).toBeInTheDocument()
    }
    expect(
      screen.getByRole("progressbar", { name: "Lessons completed" }),
    ).toHaveAttribute("aria-valuemax", String(concepts.length))
  })

  it("marks Concentration up next on a first run, the rest not started", () => {
    renderWithDemo(<LearnPage />, { session: finishedSession })

    expect(
      within(card("concentration")).getByText(learnPage.status.next),
    ).toBeInTheDocument()
    expect(
      within(card("rebalancing")).getByText(learnPage.status.notStarted),
    ).toBeInTheDocument()
  })

  it("shows what the regular preview already learned", () => {
    renderWithDemo(<LearnPage />)

    for (const id of ["rebalancing", "roth-ira", "expense-ratio"]) {
      expect(
        within(card(id)).getByText(learnPage.status.learned),
      ).toBeInTheDocument()
    }
  })

  it("plays the Concentration lesson; the others are coming soon", async () => {
    const user = userEvent.setup()
    renderWithDemo(
      <>
        <LearnPage />
        <LessonLayer />
      </>,
      { session: finishedSession },
    )

    await user.click(
      within(card("tax-loss-harvesting")).getByRole("button", {
        name: learnPage.start,
      }),
    )
    expect(toast).toHaveBeenCalledWith(
      comingSoon.title,
      expect.objectContaining({ description: comingSoon.description }),
    )

    await user.click(
      within(card("concentration")).getByRole("button", {
        name: learnPage.start,
      }),
    )
    expect(
      await screen.findByRole("dialog", { name: concepts[0].title }),
    ).toBeInTheDocument()
  })
})
