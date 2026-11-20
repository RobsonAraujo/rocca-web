import "server-only"

import { getServerEnv } from "@/lib/env"

import type { NewsProvider } from "../types"
import { createFinnhubProvider } from "./finnhub"
import { createMassiveProvider } from "./massive"
import { createSimulatedProvider } from "./simulated"

let warned = false

/**
 * The news sources to try, in order: Massive (MASSIVE_API_KEY), then Finnhub
 * (FINNHUB_API_KEY), and always the simulated headlines last, which never
 * fail. A failing provider (rate limit, outage) falls through to the next.
 * Swapping providers needs no change outside this folder.
 */
export function getNewsProviders(): NewsProvider[] {
  const { MASSIVE_API_KEY, FINNHUB_API_KEY } = getServerEnv()
  const live: NewsProvider[] = []
  if (MASSIVE_API_KEY) live.push(createMassiveProvider(MASSIVE_API_KEY))
  if (FINNHUB_API_KEY) live.push(createFinnhubProvider(FINNHUB_API_KEY))

  if (live.length === 0 && !warned) {
    warned = true
    console.warn(
      "[news] No MASSIVE_API_KEY or FINNHUB_API_KEY: showing simulated headlines.",
    )
  }
  return [...live, createSimulatedProvider()]
}
