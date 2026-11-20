import { describe, expect, it } from "vitest"

import { createSimulatedProvider } from "./providers/simulated"
import {
  NEWS_SYMBOLS,
  exposureFor,
  isOpinion,
  looksEnglish,
  rankNews,
} from "./relevance"
import type { NewsItem } from "./types"

const item = (overrides: Partial<NewsItem> = {}): NewsItem => ({
  id: overrides.id ?? "1",
  headline: "Nvidia reports record data center revenue",
  source: "Reuters",
  url: "https://example.com/a",
  publishedAt: "2026-11-19T15:00:00.000Z",
  tickers: ["NVDA"],
  ...overrides,
})

describe("isOpinion", () => {
  it.each([
    "1 Unstoppable Stock to Buy Before It Joins NVDA and AAPL in the $1 Trillion Club",
    "Should You Buy Nvidia Stock Before Earnings?",
    "3 Reasons to Buy Microsoft Stock Like There's No Tomorrow",
    "Prediction: This AI Stock Will Be Worth More Than Apple",
    "Is It Too Late to Buy Alphabet Stock?",
    // Seen in the live Finnhub feed:
    "History Says This Brilliant ETF Could Help You Turn $500 Per Month Into $784,100 While Barely Lifting a Finger.",
    "Why Nvidia's sell-off could be a buying opportunity (with a catch)",
    "Should You Avoid MercadoLibre (MELI) Stock, Even Now That It's Near a 52-Week Low?",
  ])("flags opinion and clickbait: %s", (headline) => {
    expect(isOpinion({ headline, source: "Yahoo" })).toBe(true)
  })

  it.each([
    "Amazon Urges NYC Customers to Oppose Mamdani-Backed Delivery Bill",
    "Apple to Buy Back $110 Billion in Shares",
    "Nvidia reports record data center revenue",
    "California attorney general subpoenas Nvidia over chips, former CEO's affair",
    "Why Nvidia Stock Fell Today",
  ])("keeps news: %s", (headline) => {
    expect(isOpinion({ headline, source: "Yahoo" })).toBe(false)
  })

  it("flags recommendation-first publishers", () => {
    expect(
      isOpinion({
        headline: "Apple's quarter, explained",
        source: "Motley Fool",
      }),
    ).toBe(true)
  })
})

describe("exposureFor", () => {
  it("adds direct and through-fund exposure", () => {
    const nvda = exposureFor("nvda")!
    expect(nvda.symbol).toBe("NVDA")
    expect(nvda.total).toBeCloseTo(0.221)
  })

  it("knows stocks held only through funds", () => {
    expect(exposureFor("AMZN")).toMatchObject({ direct: 0, viaFunds: 0.021 })
  })

  it("returns nothing for stocks the portfolio doesn't hold", () => {
    expect(exposureFor("TSLA")).toBeUndefined()
  })

  it("watches every stock the exposure card shows", () => {
    expect(NEWS_SYMBOLS).toEqual(["NVDA", "AAPL", "MSFT", "AMZN", "GOOGL"])
  })
})

describe("rankNews", () => {
  it("merges the same story fetched for two tickers", () => {
    const headline = "Nvidia and Microsoft expand their AI partnership"
    const { items } = rankNews([
      item({ id: "a", headline, tickers: ["NVDA"] }),
      item({ id: "b", headline, tickers: ["MSFT"] }),
    ])
    expect(items).toHaveLength(1)
    expect(items[0]!.impact.map((e) => e.symbol)).toEqual(["NVDA", "MSFT"])
  })

  it("only keeps tickers the story actually names (feeds tag loosely)", () => {
    const { items } = rankNews([
      item({
        id: "crwd",
        url: "u1",
        headline:
          "Why CrowdStrike Holdings Stock Flew While the Market Flopped",
        tickers: ["NVDA"],
      }),
      item({
        id: "ag",
        url: "u2",
        headline: "California attorney general subpoenas chipmaker",
        summary: "The inquiry covers Nvidia's export practices.",
        tickers: ["NVDA", "AAPL"],
      }),
    ])
    expect(items.map((i) => i.id)).toEqual(["ag"])
    expect(items[0]!.impact.map((e) => e.symbol)).toEqual(["NVDA"])
  })

  it("counts a press release only when the company issued it", () => {
    const { items } = rankNews([
      item({
        id: "pixalate",
        url: "u1",
        source: "GlobeNewswire Inc.",
        headline: "Pixalate Launches IVT Blocking on Amazon Web Services (AWS)",
        tickers: ["AMZN"],
      }),
      item({
        id: "nvidia",
        url: "u2",
        source: "GlobeNewswire Inc.",
        headline: "NVIDIA Announces Upcoming Event for Financial Community",
        tickers: ["NVDA"],
      }),
    ])
    expect(items.map((i) => i.id)).toEqual(["nvidia"])
  })

  it("skips headlines that aren't in English", () => {
    expect(
      looksEnglish(
        "Esker réinvente l'expérience Source-to-Pay avec Microsoft Copilot",
      ),
    ).toBe(false)
    expect(looksEnglish("Nestlé and Microsoft sign a cloud deal")).toBe(true)

    const { items } = rankNews([
      item({
        headline:
          "Esker réinvente l'expérience Source-to-Pay avec Microsoft Copilot",
        tickers: ["MSFT"],
      }),
    ])
    expect(items).toEqual([])
  })

  it("treats press-release attachments as logos, not covers", () => {
    const { items } = rankNews([
      item({
        image:
          "https://ml.globenewswire.com/Resource/Download/ad3b9553-6933-40b1-adfd-2ed199cd141c",
      }),
    ])
    expect(items[0]!.image).toBeUndefined()
  })

  it("drops logos posing as cover images", () => {
    const yahooLogo =
      "https://s.yimg.com/rz/stage/p/yahoo_finance_en-US_h_p_finance_2.png"
    const { items } = rankNews([
      item({ id: "a", url: "u1", headline: "Nvidia a", image: yahooLogo }),
      item({
        id: "b",
        url: "u2",
        headline: "Nvidia b",
        image: "https://x.com/same.jpg",
      }),
      item({
        id: "c",
        url: "u3",
        headline: "Nvidia c",
        image: "https://x.com/same.jpg",
      }),
      item({
        id: "d",
        url: "u4",
        headline: "Apple d",
        image: "https://x.com/d.jpg",
        tickers: ["AAPL"],
      }),
    ])
    const images = Object.fromEntries(items.map((i) => [i.id, i.image]))
    expect(images).toEqual({
      a: undefined,
      b: undefined,
      c: undefined,
      d: "https://x.com/d.jpg",
    })
  })

  it("shows at most two stories about the same stock when others are in the news", () => {
    const at = (hour: number) =>
      `2026-11-19T${String(hour).padStart(2, "0")}:00:00Z`
    const nvda = (n: number) =>
      item({
        id: `n${n}`,
        url: `${n}`,
        headline: `Nvidia ${n}`,
        source: `Outlet ${n}`,
        publishedAt: at(21 - n),
      })
    const { items } = rankNews(
      [
        nvda(1),
        nvda(2),
        nvda(3),
        nvda(4),
        item({
          id: "amzn",
          url: "5",
          headline: "Amazon news",
          source: "Outlet 5",
          tickers: ["AMZN"],
          publishedAt: at(10),
        }),
      ],
      3,
    )
    expect(items.map((i) => i.id)).toEqual(["n1", "n2", "amzn"])
  })

  it("shows at most two stories from the same publisher when others have news", () => {
    const at = (hour: number) =>
      `2026-11-19T${String(hour).padStart(2, "0")}:00:00Z`
    const { items } = rankNews(
      [
        item({
          id: "z1",
          url: "1",
          headline: "Nvidia z1",
          source: "Zacks",
          publishedAt: at(20),
        }),
        item({
          id: "z2",
          url: "2",
          headline: "Apple z2",
          source: "Zacks",
          tickers: ["AAPL"],
          publishedAt: at(19),
        }),
        item({
          id: "z3",
          url: "3",
          headline: "Microsoft z3",
          source: "Zacks",
          tickers: ["MSFT"],
          publishedAt: at(18),
        }),
        item({
          id: "r1",
          url: "4",
          headline: "Amazon r1",
          source: "Reuters",
          tickers: ["AMZN"],
          publishedAt: at(10),
        }),
      ],
      3,
    )
    expect(items.map((i) => i.id)).toEqual(["z1", "z2", "r1"])
  })

  it("puts stories that name the company in the headline ahead of passing mentions", () => {
    const { items } = rankNews(
      [
        item({
          id: "spotify",
          url: "1",
          headline: "Spotify's ARPU rise signals stronger premium monetization",
          summary: "It is gaining on Apple Music.",
          tickers: ["AAPL"],
          publishedAt: "2026-11-19T20:00:00Z",
        }),
        item({
          id: "apple",
          url: "2",
          headline: "Apple sets the date for its next product event",
          tickers: ["AAPL"],
          publishedAt: "2026-11-19T09:00:00Z",
        }),
      ],
      1,
    )
    expect(items.map((i) => i.id)).toEqual(["apple"])
  })

  it("drops stories about stocks the user doesn't own", () => {
    const { items } = rankNews([item({ tickers: ["TSLA"] })])
    expect(items).toEqual([])
  })

  it("sorts newest first, caps the list and hides opinion", () => {
    const news = [
      item({
        id: "old",
        url: "u1",
        headline: "Nvidia, older story",
        publishedAt: "2026-11-17T10:00:00Z",
      }),
      item({
        id: "new",
        url: "u2",
        headline: "Nvidia, newer story",
        publishedAt: "2026-11-19T10:00:00Z",
      }),
      item({
        id: "op",
        url: "u3",
        headline: "1 Unstoppable Stock to Buy Now: Nvidia",
        publishedAt: "2026-11-19T11:00:00Z",
      }),
    ]
    const ranked = rankNews(news, 1)
    expect(ranked.items.map((i) => i.id)).toEqual(["new"])
    expect(ranked.hiddenOpinion.map((i) => i.id)).toEqual(["op"])
  })

  it("turns the simulated feed into 5 headlines and 2 hidden opinion pieces", async () => {
    const provider = createSimulatedProvider(
      () => new Date("2026-11-19T20:00:00Z"),
    )
    const raw = await provider.getCompanyNews(NEWS_SYMBOLS, {
      from: "2026-11-16",
      to: "2026-11-19",
    })
    const ranked = rankNews(raw)
    expect(ranked.items).toHaveLength(5)
    expect(ranked.hiddenOpinion).toHaveLength(2)
    expect(ranked.items.every((i) => i.source === "Simulated" && !i.url)).toBe(
      true,
    )
  })
})
