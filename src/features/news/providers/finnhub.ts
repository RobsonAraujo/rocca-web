import { z } from "zod"

import type { NewsItem, NewsProvider } from "../types"
import { coverImage } from "./shared"

const COMPANY_NEWS_URL = "https://finnhub.io/api/v1/company-news"

/** One article from /company-news. Items that don't match are skipped. */
const articleSchema = z.object({
  id: z.number(),
  /** Unix time, in seconds. */
  datetime: z.number(),
  headline: z.string().min(1),
  summary: z.string().optional(),
  source: z.string().min(1),
  url: z.url(),
  /** Cover image URL; often empty. */
  image: z.string().optional(),
  /** Comma-separated tickers, e.g. "AAPL,MSFT". */
  related: z.string().optional(),
})

function tickersFrom(symbol: string, related: string | undefined) {
  const others = (related ?? "")
    .split(",")
    .map((ticker) => ticker.trim().toUpperCase())
    .filter(Boolean)
  return [...new Set([symbol.toUpperCase(), ...others])]
}

/**
 * Company news from Finnhub (https://finnhub.io), one request per ticker.
 * The key travels in a header, never in the URL, so it can't leak into logs.
 */
export function createFinnhubProvider(
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): NewsProvider {
  async function fetchSymbol(
    symbol: string,
    range: { from: string; to: string },
  ): Promise<NewsItem[]> {
    const url = new URL(COMPANY_NEWS_URL)
    url.search = new URLSearchParams({
      symbol,
      from: range.from,
      to: range.to,
    }).toString()

    const response = await fetchImpl(url, {
      headers: { "X-Finnhub-Token": apiKey },
    })
    if (!response.ok) {
      throw new Error(
        `Finnhub company news for ${symbol} failed with HTTP ${response.status}`,
      )
    }

    const body: unknown = await response.json()
    if (!Array.isArray(body)) {
      throw new Error(`Finnhub company news for ${symbol}: unexpected response`)
    }

    return body.flatMap((raw): NewsItem[] => {
      const parsed = articleSchema.safeParse(raw)
      if (!parsed.success) return []
      const article = parsed.data
      return [
        {
          id: `finnhub-${article.id}`,
          headline: article.headline,
          summary: article.summary || undefined,
          source: article.source,
          url: article.url,
          image: coverImage(article.image),
          publishedAt: new Date(article.datetime * 1000).toISOString(),
          tickers: tickersFrom(symbol, article.related),
        },
      ]
    })
  }

  return {
    name: "Finnhub",
    live: true,
    async getCompanyNews(symbols, range) {
      const lists = await Promise.all(
        symbols.map((symbol) => fetchSymbol(symbol, range)),
      )
      return lists.flat()
    },
  }
}
