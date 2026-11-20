/** One headline, normalized from whichever provider fetched it. */
export type NewsItem = {
  id: string
  headline: string
  summary?: string
  /** Publisher name, as the provider reports it. */
  source: string
  /** Link to the original article. Simulated headlines have none. */
  url?: string
  /** The article's cover image (https), hosted by the publisher. */
  image?: string
  /** ISO 8601 timestamp. */
  publishedAt: string
  /** Tickers the article is about, upper case. */
  tickers: string[]
}

/** Inclusive date range, as YYYY-MM-DD strings. */
export type DateRange = { from: string; to: string }

export interface NewsProvider {
  /** Shown in the card's badge and attribution ("Live · Finnhub"). */
  readonly name: string
  /** True for real headlines, false for the simulated fallback. */
  readonly live: boolean
  getCompanyNews(
    symbols: readonly string[],
    range: DateRange,
  ): Promise<NewsItem[]>
}
