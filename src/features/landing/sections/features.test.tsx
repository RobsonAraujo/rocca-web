import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { features, illustrations, preview } from "@/features/landing/content"

import { Features } from "./features"

describe("Features", () => {
  it("renders one card per feature, including Learn as you go", () => {
    render(<Features />)

    for (const { title } of features.items) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument()
    }
    expect(features.items.map((item) => item.id)).toContain("learn")
  })

  it("shows the same lesson and tax detail as the dashboard preview", () => {
    render(<Features />)

    expect(screen.getByText(illustrations.learn.next.title)).toBeInTheDocument()
    expect(
      screen.getByText(preview.order.taxSmart.estimate),
    ).toBeInTheDocument()
  })
})
