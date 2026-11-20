import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { liveNews } from "@/features/landing/content"

import { LiveNews } from "./live-news"

describe("LiveNews", () => {
  it("frames the news card and points visitors to the waitlist", () => {
    render(
      <LiveNews>
        <p>news card</p>
      </LiveNews>,
    )

    expect(
      screen.getByRole("region", { name: liveNews.title }),
    ).toBeInTheDocument()
    expect(screen.getByText("news card")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: liveNews.cta })).toHaveAttribute(
      "href",
      "#waitlist",
    )
  })
})
