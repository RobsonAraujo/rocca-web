import { z } from "zod"

import type { DateRange, NewsItem, NewsProvider } from "../types"
import { coverImage } from "./shared"

/** Ticker news (formerly Polygon.io): https://massive.com/docs/rest/stocks/news */
const NEWS_URL = "https://api.massive.com/v2/reference/news"

/** Newest articles fetched per ticker; the ranking keeps the best few. */
const PER_TICKER = 20

/** One article from /v2/reference/news. Items that don't match are skipped. */
const articleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullish(),
  /** RFC 3339, e.g. 2026-11-19T20:42:00Z. */
  published_utc: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
  article_url: z.url(),
  image_url: z.string().nullish(),
  tickers: z.array(z.string()).nullish(),
  publisher: z.object({ name: z.string().min(1) }).nullish(),
})

const responseSchema = z.object({
  results: z.array(z.unknown()).nullish(),
})

/**
 * Company news from Massive, one request per ticker (the endpoint takes a
 * single ticker). The key goes in the Authorization header, never in the
 * URL, so it can't leak into logs. Articles come with real cover images.
 */
export function createMassiveProvider(
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): NewsProvider {
  async function fetchSymbol(
    symbol: string,
    range: DateRange,
  ): Promise<NewsItem[]> {
    const url = new URL(NEWS_URL)
    url.search = new URLSearchParams({
      ticker: symbol,
      "published_utc.gte": range.from,
      order: "desc",
      sort: "published_utc",
      limit: String(PER_TICKER),
    }).toString()

    const response = await fetchImpl(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!response.ok) {
      throw new Error(
        `Massive news for ${symbol} failed with HTTP ${response.status}`,
      )
    }

    const body = responseSchema.safeParse(await response.json())
    if (!body.success) {
      throw new Error(`Massive news for ${symbol}: unexpected response`)
    }

    return (body.data.results ?? []).flatMap((raw): NewsItem[] => {
      const parsed = articleSchema.safeParse(raw)
      if (!parsed.success) return []
      const article = parsed.data
      return [
        {
          id: `massive-${article.id}`,
          headline: article.title,
          summary: article.description || undefined,
          source:
            article.publisher?.name ?? new URL(article.article_url).hostname,
          url: article.article_url,
          image: coverImage(article.image_url),
          publishedAt: new Date(article.published_utc).toISOString(),
          tickers: [
            ...new Set(
              [symbol, ...(article.tickers ?? [])].map((t) => t.toUpperCase()),
            ),
          ],
        },
      ]
    })
  }

  return {
    name: "Massive",
    live: true,
    async getCompanyNews(symbols, range) {
      const lists = await Promise.all(
        symbols.map((symbol) => fetchSymbol(symbol, range)),
      )
      return lists.flat()
    },
  }
}
