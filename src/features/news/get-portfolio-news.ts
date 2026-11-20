import "server-only"

import { cacheLife } from "next/cache"

import { getNewsProviders } from "./providers"
import { createSimulatedProvider } from "./providers/simulated"
import type { RankedNews } from "./relevance"
import { NEWS_SYMBOLS, rankNews } from "./relevance"
import type { DateRange, NewsProvider } from "./types"

export type PortfolioNews = RankedNews & {
  /** False when the headlines are the simulated fallback. */
  live: boolean
  /** Provider name, for the badge and the attribution. */
  provider: string
}

/** How far back to look for headlines. */
const WINDOW_DAYS = 3
const DAY = 86_400_000

const isoDay = (date: Date) => date.toISOString().slice(0, 10)

async function collect(provider: NewsProvider, range: DateRange) {
  const items = await provider.getCompanyNews(NEWS_SYMBOLS, range)
  return { live: provider.live, provider: provider.name, ...rankNews(items) }
}

/** The providers to try; a broken env config still leaves the simulated one. */
function providersOrSimulated(now: Date): NewsProvider[] {
  try {
    return getNewsProviders()
  } catch (error) {
    console.warn("[news] Couldn't set up news providers.", error)
    return [createSimulatedProvider(() => now)]
  }
}

/**
 * Headlines about what the portfolio owns, ranked and filtered. Cached and
 * shared by every visitor: refreshed in the background every 10 minutes
 * (5 provider calls per refresh). Providers are tried in order (Massive,
 * Finnhub, simulated), so a rate limit or outage never breaks the page.
 */
export async function getPortfolioNews(): Promise<PortfolioNews> {
  "use cache"
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 })

  const now = new Date()
  const range = {
    from: isoDay(new Date(now.getTime() - WINDOW_DAYS * DAY)),
    to: isoDay(now),
  }

  const providers = providersOrSimulated(now)
  for (const provider of providers.slice(0, -1)) {
    try {
      return await collect(provider, range)
    } catch (error) {
      console.warn(
        `[news] ${provider.name} failed; trying the next source.`,
        error,
      )
    }
  }
  // The last provider is the simulated one, which doesn't fail.
  return collect(providers.at(-1)!, range)
}
