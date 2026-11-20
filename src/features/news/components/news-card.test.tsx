import { fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { newsCopy } from "../content"
import type { PortfolioNews } from "../get-portfolio-news"
import { rankNews } from "../relevance"
import type { NewsItem } from "../types"
import { NewsCard } from "./news-card"

const raw: NewsItem[] = [
  {
    id: "nvda",
    headline: "Nvidia reports record data center revenue",
    source: "Reuters",
    url: "https://example.com/nvda",
    image: "https://cdn.example.com/nvda.jpg",
    summary: "Data center sales beat estimates again.",
    publishedAt: "2026-11-19T20:42:00Z",
    tickers: ["NVDA"],
  },
  {
    id: "amzn",
    headline:
      "Amazon Urges NYC Customers to Oppose Mamdani-Backed Delivery Bill",
    source: "Bloomberg",
    url: "https://example.com/amzn",
    publishedAt: "2026-11-19T18:00:00Z",
    tickers: ["AMZN"],
  },
  {
    id: "fool",
    headline:
      "1 Unstoppable Stock to Buy Before It Joins NVDA and AAPL in the $1 Trillion Club",
    source: "Yahoo",
    url: "https://example.com/fool",
    publishedAt: "2026-11-19T19:00:00Z",
    tickers: ["NVDA"],
  },
]

const liveNews: PortfolioNews = {
  live: true,
  provider: "Finnhub",
  ...rankNews(raw),
}

/** Tickers shown on image fallback tiles, in page order. */
const fallbackTiles = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-slot="news-image-fallback"]')].map(
    (tile) => tile.textContent,
  )

describe("NewsCard", () => {
  it("links each headline to its source and shows the exposure it touches", () => {
    render(<NewsCard id="news" news={liveNews} />)

    const link = screen.getByRole("link", { name: /Nvidia reports record/ })
    expect(link).toHaveAttribute("href", "https://example.com/nvda")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")

    expect(screen.getByText("NVDA · 22.1% of your money")).toBeInTheDocument()
    expect(screen.getByText("AMZN · 2.1% via your funds")).toBeInTheDocument()
    expect(screen.getByText("Nov 19, 3:42 PM ET")).toBeInTheDocument()
  })

  it("features the newest story with its cover, and a ticker tile when there's none", () => {
    const { container } = render(<NewsCard id="news" news={liveNews} />)

    const cover = container.querySelector("img")
    expect(cover).toHaveAttribute("src", "https://cdn.example.com/nvda.jpg")
    expect(cover).toHaveAttribute("referrerpolicy", "no-referrer")
    expect(cover).toHaveAttribute("alt", "")
    expect(
      screen.getByText("Data center sales beat estimates again."),
    ).toBeInTheDocument()
    expect(fallbackTiles(container)).toEqual(["AMZN"])
  })

  it("features the newest story that has a photo", () => {
    const withPhotoOlder: PortfolioNews = {
      live: true,
      provider: "Massive",
      ...rankNews([
        { ...raw[1]!, publishedAt: "2026-11-19T22:00:00Z" }, // newest, no photo
        raw[0]!, // older, with photo
      ]),
    }
    const { container } = render(<NewsCard id="news" news={withPhotoOlder} />)

    const featured = container.querySelector("article")!
    expect(within(featured).getByRole("heading")).toHaveTextContent(
      /Nvidia reports record/,
    )
  })

  it("swaps a cover that fails to load for the ticker tile", () => {
    const { container } = render(<NewsCard id="news" news={liveNews} />)

    fireEvent.error(container.querySelector("img")!)

    expect(container.querySelector("img")).toBeNull()
    expect(fallbackTiles(container)).toEqual(["NVDA", "AMZN"])
  })

  it("labels live headlines with their provider", () => {
    render(<NewsCard id="news" news={liveNews} />)

    expect(screen.getByText("Live · Finnhub")).toBeInTheDocument()
    expect(screen.getByText(/Headlines via Finnhub/)).toBeInTheDocument()
  })

  it("hides opinion pieces until asked", async () => {
    const user = userEvent.setup()
    render(<NewsCard id="news" news={liveNews} />)

    expect(screen.queryByText(/Unstoppable Stock/)).not.toBeInTheDocument()
    expect(screen.getByText("Rocca hid 1 opinion piece")).toBeInTheDocument()

    const toggle = screen.getByRole("button", { name: newsCopy.hidden.show })
    await user.click(toggle)

    expect(toggle).toHaveAttribute("aria-expanded", "true")
    const opinion = screen.getByRole("link", { name: /Unstoppable Stock/ })
    expect(
      within(opinion.closest("li")!).getByText(newsCopy.hidden.tag),
    ).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: newsCopy.hidden.hide }))
    expect(screen.queryByText(/Unstoppable Stock/)).not.toBeInTheDocument()
  })

  it("marks simulated headlines and doesn't link them", () => {
    const simulated: PortfolioNews = {
      live: false,
      provider: "Simulated",
      ...rankNews(
        raw.map((item) => ({ ...item, url: undefined, source: "Simulated" })),
      ),
    }
    render(<NewsCard id="news" news={simulated} />)

    expect(screen.getByText(newsCopy.simulated)).toBeInTheDocument()
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })

  it("says so when nothing about the portfolio came in", () => {
    render(
      <NewsCard
        id="news"
        news={{ live: true, provider: "Finnhub", items: [], hiddenOpinion: [] }}
      />,
    )
    expect(screen.getByText(newsCopy.empty)).toBeInTheDocument()
  })
})
