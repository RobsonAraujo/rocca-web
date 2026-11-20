import type { NewsItem, NewsProvider } from "../types"

const HOUR = 3_600_000

/**
 * Sample headlines for the simulated portfolio, used when there's no live
 * provider or it fails. They name no real publisher and link nowhere, so a
 * made-up story is never attributed to a real outlet. Two are opinion pieces,
 * to show the filter at work. NVDA's earnings match the demo's "Coming up".
 * No cover images: the card shows its ticker tile instead.
 */
const FIXTURES: {
  hoursAgo: number
  headline: string
  summary?: string
  tickers: string[]
}[] = [
  {
    hoursAgo: 2,
    headline:
      "Nvidia heads into Wednesday's earnings with data center orders in focus",
    summary:
      "Analysts expect another record quarter, with attention on how much of next year's data center demand is already booked.",
    tickers: ["NVDA"],
  },
  {
    hoursAgo: 4,
    headline: "Amazon pushes back on proposed New York delivery rules",
    tickers: ["AMZN"],
  },
  {
    hoursAgo: 6,
    headline: "1 Unstoppable Stock to Buy Before Nvidia Hits $5 Trillion",
    tickers: ["NVDA"],
  },
  {
    hoursAgo: 9,
    headline: "Microsoft expands AI capacity with new data center deals",
    tickers: ["MSFT"],
  },
  {
    hoursAgo: 14,
    headline: "Should You Buy Apple Stock Before the Holidays?",
    tickers: ["AAPL"],
  },
  {
    hoursAgo: 20,
    headline: "Alphabet faces a new antitrust filing over search deals",
    tickers: ["GOOGL"],
  },
  {
    hoursAgo: 26,
    headline: "Apple sets the date for its next product event",
    tickers: ["AAPL"],
  },
]

export const SIMULATED_SOURCE = "Simulated"

export function createSimulatedProvider(
  now: () => Date = () => new Date(),
): NewsProvider {
  return {
    name: SIMULATED_SOURCE,
    live: false,
    async getCompanyNews(symbols) {
      const wanted = new Set(symbols.map((s) => s.toUpperCase()))
      const at = now().getTime()
      return FIXTURES.filter((fixture) =>
        fixture.tickers.some((ticker) => wanted.has(ticker)),
      ).map((fixture, index): NewsItem => ({
        id: `simulated-${index}`,
        headline: fixture.headline,
        summary: fixture.summary,
        source: SIMULATED_SOURCE,
        publishedAt: new Date(at - fixture.hoursAgo * HOUR).toISOString(),
        tickers: fixture.tickers,
      }))
    },
  }
}
