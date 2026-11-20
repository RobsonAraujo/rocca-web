import { describe, expect, it, vi } from "vitest"

import { getPortfolioNews } from "./get-portfolio-news"
import { createSimulatedProvider } from "./providers/simulated"
import type { NewsProvider } from "./types"

const setup = vi.hoisted(() => ({ providers: [] as NewsProvider[] }))

// `use cache` and cacheLife only mean something inside Next; here the
// function runs directly.
vi.mock("next/cache", () => ({ cacheLife: vi.fn() }))
vi.mock("./providers", () => ({ getNewsProviders: () => setup.providers }))

const live = (name: string, fail = false): NewsProvider => ({
  name,
  live: true,
  getCompanyNews: async () => {
    if (fail) throw new Error("HTTP 429")
    return [
      {
        id: `${name}-1`,
        headline: "Nvidia reports record data center revenue",
        source: "Reuters",
        url: "https://example.com/a",
        publishedAt: new Date().toISOString(),
        tickers: ["NVDA"],
      },
    ]
  },
})

describe("getPortfolioNews", () => {
  it("ranks the first provider's headlines", async () => {
    setup.providers = [
      live("Massive"),
      live("Finnhub"),
      createSimulatedProvider(),
    ]

    const news = await getPortfolioNews()

    expect(news).toMatchObject({ live: true, provider: "Massive" })
    expect(news.items.map((item) => item.id)).toEqual(["Massive-1"])
  })

  it("falls through to the next provider when one fails", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    setup.providers = [
      live("Massive", true),
      live("Finnhub"),
      createSimulatedProvider(),
    ]

    const news = await getPortfolioNews()

    expect(news).toMatchObject({ live: true, provider: "Finnhub" })
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Massive failed"),
      expect.any(Error),
    )
  })

  it("ends on simulated headlines when every live provider fails", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    setup.providers = [
      live("Massive", true),
      live("Finnhub", true),
      createSimulatedProvider(),
    ]

    const news = await getPortfolioNews()

    expect(news).toMatchObject({ live: false, provider: "Simulated" })
    expect(news.items.length).toBeGreaterThan(0)
  })
})
