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

/** The story <article> whose headline matches. */
const story = (headline: RegExp) =>
  screen.getByRole("heading", { name: headline }).closest("article")!

describe("NewsCard", () => {
  it("links each headline to its source, in a new tab", () => {
    render(<NewsCard id="news" news={liveNews} />)

    const link = screen.getByRole("link", { name: /Nvidia reports record/ })
    expect(link).toHaveAttribute("href", "https://example.com/nvda")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("names the companies above each headline and shows the portfolio it touches", () => {
    render(<NewsCard id="news" news={liveNews} />)

    const nvda = story(/Nvidia reports record/)
    expect(within(nvda).getByText("Nvidia")).toBeInTheDocument()
    expect(
      within(nvda).getByText("22.1% of your portfolio"),
    ).toBeInTheDocument()

    const amzn = story(/Amazon Urges/)
    expect(within(amzn).getByText("Amazon")).toBeInTheDocument()
    expect(
      within(amzn).getByText("2.1% of your portfolio, via your funds"),
    ).toBeInTheDocument()
  })

  it("names at most two companies in a kicker", () => {
    const news: PortfolioNews = {
      live: true,
      provider: "Massive",
      ...rankNews([
        {
          id: "trio",
          headline: "Nvidia, Microsoft and Amazon team up on AI chips",
          source: "Reuters",
          url: "https://example.com/trio",
          publishedAt: "2026-11-19T20:00:00Z",
          tickers: ["NVDA", "MSFT", "AMZN"],
        },
      ]),
    }
    render(<NewsCard id="news" news={news} />)

    expect(
      within(story(/team up/)).getByText("Nvidia · Microsoft +1"),
    ).toBeInTheDocument()
  })

  it("dates each story, keeping the exact time as a tooltip", () => {
    render(<NewsCard id="news" news={liveNews} />)

    const time = story(/Nvidia reports record/).querySelector("time")!
    expect(time).toHaveAttribute("datetime", "2026-11-19T20:42:00Z")
    expect(time).toHaveAttribute("title", "Nov 19, 3:42 PM ET")
  })

  it("leads with the cover photo and shows no placeholder for stories without one", () => {
    const { container } = render(<NewsCard id="news" news={liveNews} />)

    const images = container.querySelectorAll("img")
    expect(images).toHaveLength(1)
    expect(images[0]).toHaveAttribute("src", "https://cdn.example.com/nvda.jpg")
    expect(images[0]).toHaveAttribute("referrerpolicy", "no-referrer")
    expect(images[0]).toHaveAttribute("alt", "")
    expect(
      screen.getByText("Data center sales beat estimates again."),
    ).toBeInTheDocument()
  })

  it("drops the lead story in the compact (dashboard) layout", () => {
    const { container } = render(
      <NewsCard id="news" layout="compact" news={liveNews} />,
    )

    // Every story is a row: no standfirst under a big lead.
    expect(
      screen.queryByText("Data center sales beat estimates again."),
    ).not.toBeInTheDocument()
    expect(container.querySelectorAll("article")).toHaveLength(
      liveNews.items.length,
    )
  })

  it("features the newest story that has a photo", () => {
    const news: PortfolioNews = {
      live: true,
      provider: "Massive",
      ...rankNews([
        { ...raw[1]!, publishedAt: "2026-11-19T22:00:00Z" }, // newest, no photo
        raw[0]!, // older, with photo
      ]),
    }
    const { container } = render(<NewsCard id="news" news={news} />)

    const lead = container.querySelector("article")!
    expect(within(lead).getByRole("heading")).toHaveTextContent(
      /Nvidia reports record/,
    )
  })

  it("drops a cover photo that fails to load", () => {
    const { container } = render(<NewsCard id="news" news={liveNews} />)

    fireEvent.error(container.querySelector("img")!)

    expect(container.querySelector("img")).toBeNull()
  })

  it("marks live headlines and credits the provider", () => {
    render(<NewsCard id="news" news={liveNews} />)

    expect(screen.getByText(newsCopy.live)).toBeInTheDocument()
    expect(
      screen.getByText("Headlines via Finnhub. The portfolio is simulated."),
    ).toBeInTheDocument()
  })

  it("hides opinion pieces until asked", async () => {
    const user = userEvent.setup()
    render(<NewsCard id="news" news={liveNews} />)

    expect(screen.queryByText(/Unstoppable Stock/)).not.toBeInTheDocument()
    expect(screen.getByText(/Rocca hid 1 opinion piece\./)).toBeInTheDocument()

    const toggle = screen.getByRole("button", { name: newsCopy.hidden.show })
    await user.click(toggle)

    expect(toggle).toHaveAttribute("aria-expanded", "true")
    const opinion = story(/Unstoppable Stock/)
    expect(within(opinion).getByText(newsCopy.hidden.tag)).toBeInTheDocument()

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
    expect(
      screen.getByText(newsCopy.byAudience.portfolio.empty),
    ).toBeInTheDocument()
  })

  it("never mentions your portfolio on the public card (no account connected)", () => {
    const { container } = render(
      <NewsCard id="news" audience="public" news={liveNews} />,
    )

    expect(
      screen.getByRole("heading", {
        name: newsCopy.byAudience.public.title,
      }),
    ).toBeInTheDocument()
    expect(container).not.toHaveTextContent(/your portfolio|your funds/)
    expect(container).not.toHaveTextContent(/portfolio is simulated/)
    expect(
      within(story(/Amazon Urges/)).getByText("Amazon"),
    ).toBeInTheDocument()
    expect(screen.getByText("Headlines via Finnhub.")).toBeInTheDocument()
  })
})
