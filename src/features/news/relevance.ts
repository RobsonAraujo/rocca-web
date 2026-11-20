import { exposure } from "@/features/preview/portfolio/data"

import type { NewsItem } from "./types"

/**
 * Decides which headlines matter to this portfolio and which are noise.
 * Pure functions, no I/O: the provider fetches, this ranks.
 */

/**
 * The stocks the portfolio owns, directly or through its funds. Same source
 * as the "What you really own" card, so the two never disagree.
 */
export const NEWS_SYMBOLS: readonly string[] = exposure.items.map(
  (item) => item.symbol,
)

/** How much of the portfolio rides on one stock (fractions, 0.18 = 18%). */
export type Exposure = {
  symbol: string
  direct: number
  viaFunds: number
  total: number
}

export function exposureFor(symbol: string): Exposure | undefined {
  const item = exposure.items.find((i) => i.symbol === symbol.toUpperCase())
  if (!item) return undefined
  return {
    symbol: item.symbol,
    direct: item.direct,
    viaFunds: item.viaFunds,
    total: item.direct + item.viaFunds,
  }
}

/**
 * Hot takes, "stocks to buy" lists and clickbait: they don't change what
 * the user owns, so Rocca hides them by default.
 */
const OPINION_PATTERNS = [
  /\bstocks?\s+to\s+(buy|own|watch|hold)\b/i,
  /\bshould\s+you\s+(buy|sell|avoid|hold|own)\b/i,
  /\b(unstoppable|millionaire|no-brainer|screaming\s+buy|forever\s+stock)\b/i,
  /^prediction:/i,
  /^\d+\s+(best|top|reasons?|stocks?|ways?)\b/i,
  /\bbuy\s+(it\s+)?before\b/i,
  /\bis\s+it\s+(too\s+late|time)\s+to\s+buy\b/i,
  /\bhistory\s+says\b/i,
  /\bbuying\s+opportunity\b/i,
  /\b(brilliant|magnificent|incredible|monster)\s+(stock|etf|dividend)/i,
  /\bturn\s+\$[\d,.]+.*\binto\s+\$[\d,.]+/i,
]

/**
 * Names a story must use for a ticker to count. Feeds tag stories loosely
 * (a CrowdStrike piece can come back for NVDA), so a ticker only sticks
 * when the headline or summary actually mentions the company.
 */
const COMPANY_NAMES: Record<string, RegExp> = {
  NVDA: /\b(nvidia|nvda)\b/i,
  AAPL: /\b(apple|aapl|iphone)\b/i,
  MSFT: /\b(microsoft|msft|azure)\b/i,
  AMZN: /\b(amazon|amzn|aws)\b/i,
  GOOGL: /\b(alphabet|google|googl|goog|youtube)\b/i,
}

/** How the companies are named in the card's kicker ("NVIDIA · ALPHABET"). */
const DISPLAY_NAMES: Record<string, string> = {
  NVDA: "Nvidia",
  AAPL: "Apple",
  MSFT: "Microsoft",
  AMZN: "Amazon",
  GOOGL: "Alphabet",
}

export function companyName(symbol: string) {
  return DISPLAY_NAMES[symbol.toUpperCase()] ?? symbol.toUpperCase()
}

/**
 * Press-release wires. Their stories are written by whoever issues them, so
 * "Pixalate Launches … on Amazon Web Services" is Pixalate's news, not
 * Amazon's. A release counts only when it's the company's own.
 */
const PRESS_WIRES =
  /globenewswire|pr\s*newswire|business\s*wire|accesswire|newsfile/i

/** True when the headline starts with the company's name ("NVIDIA Announces…"). */
function issuedBy(item: Pick<NewsItem, "headline">, symbol: string) {
  const name = COMPANY_NAMES[symbol.toUpperCase()]
  if (!name) return false
  return new RegExp(`^\\W*${name.source}`, "i").test(item.headline)
}

/** True when the story is really about the company behind `symbol`. */
function isAbout(item: NewsItem, symbol: string) {
  return PRESS_WIRES.test(item.source)
    ? issuedBy(item, symbol)
    : mentions(item, symbol)
}

/** True when the story names the company behind `symbol`. */
export function mentions(
  item: Pick<NewsItem, "headline" | "summary">,
  symbol: string,
) {
  const text = `${item.headline} ${item.summary ?? ""}`
  const name = COMPANY_NAMES[symbol.toUpperCase()]
  return name
    ? name.test(text)
    : text
        .toUpperCase()
        .split(/[^A-Z0-9.]+/)
        .includes(symbol.toUpperCase())
}

/**
 * Publisher logos posing as cover images: Yahoo's feed sends its own logo
 * for most stories. An image shared by several stories is a logo too.
 */
const PLACEHOLDER_IMAGES = [
  /yimg\.com\/rz\/stage\//i,
  /\blogo\b/i,
  // Press-release attachments: almost always the issuer's logo.
  /globenewswire\.com\/Resource\/Download\//i,
]

/**
 * The app is in English, and wires also carry translated press releases
 * ("Esker réinvente l'expérience…"). Two or more accented letters in a
 * headline is a cheap, good-enough signal that it isn't English.
 */
export function looksEnglish(headline: string) {
  return (headline.match(/[àâäçéèêëîïôöûùüÿœæñ]/gi) ?? []).length < 2
}

/** At most this many stories about the same stock at the top of the card. */
const PER_STOCK = 2
/** Same for one publisher (free feeds lean heavily on a few). */
const PER_SOURCE = 2

/** Publishers whose stock coverage is mostly recommendations. */
const OPINION_SOURCES = /motley\s*fool|fool\.com|investorplace/i

export function isOpinion(item: Pick<NewsItem, "headline" | "source">) {
  return (
    OPINION_SOURCES.test(item.source) ||
    OPINION_PATTERNS.some((pattern) => pattern.test(item.headline))
  )
}

export type RankedNewsItem = NewsItem & {
  /** The user's exposure to each ticker in the story, largest first. */
  impact: Exposure[]
}

export type RankedNews = {
  /** Market-moving headlines about what the user owns, newest first. */
  items: RankedNewsItem[]
  /** Opinion pieces, hidden by default (newest first). */
  hiddenOpinion: RankedNewsItem[]
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const newestFirst = (a: NewsItem, b: NewsItem) =>
  Date.parse(b.publishedAt) - Date.parse(a.publishedAt)

/** True when the headline itself names one of the stocks the user owns. */
const namedInHeadline = (item: RankedNewsItem) =>
  item.impact.some((e) => mentions({ headline: item.headline }, e.symbol))

/**
 * Picks the card's stories. Headlines that name the company come before
 * stories that only mention it in passing (a Spotify piece citing Apple
 * Music), and no stock or publisher takes more than its share of the card.
 * Shown newest first.
 */
function pickDiverse(items: RankedNewsItem[], limit: number) {
  const candidates = [...items].sort(
    (a, b) =>
      Number(namedInHeadline(b)) - Number(namedInHeadline(a)) ||
      newestFirst(a, b),
  )
  const perStock = new Map<string, number>()
  const perSource = new Map<string, number>()
  const picked: RankedNewsItem[] = []
  const overflow: RankedNewsItem[] = []
  for (const item of candidates) {
    const lead = item.impact[0]!.symbol
    const stockCount = perStock.get(lead) ?? 0
    const sourceCount = perSource.get(item.source) ?? 0
    if (stockCount < PER_STOCK && sourceCount < PER_SOURCE) {
      perStock.set(lead, stockCount + 1)
      perSource.set(item.source, sourceCount + 1)
      picked.push(item)
    } else {
      overflow.push(item)
    }
  }
  // Few stocks or publishers in the news: fill the card with the rest.
  return [...picked, ...overflow].slice(0, limit).sort(newestFirst)
}

/**
 * Merges duplicates (the same story often comes back once per ticker), keeps
 * only tickers the story names and the user owns, drops logo "covers", and
 * splits out opinion.
 */
export function rankNews(items: readonly NewsItem[], limit = 5): RankedNews {
  const byUrl = new Map<string, NewsItem>()
  const byHeadline = new Map<string, NewsItem>()
  const unique: NewsItem[] = []

  for (const item of items) {
    const headlineKey = normalize(item.headline)
    const existing =
      (item.url && byUrl.get(item.url)) || byHeadline.get(headlineKey)
    if (existing) {
      existing.tickers = [...new Set([...existing.tickers, ...item.tickers])]
      continue
    }
    const copy = { ...item, tickers: [...new Set(item.tickers)] }
    if (copy.url) byUrl.set(copy.url, copy)
    byHeadline.set(headlineKey, copy)
    unique.push(copy)
  }

  const imageUses = new Map<string, number>()
  for (const item of unique) {
    if (item.image)
      imageUses.set(item.image, (imageUses.get(item.image) ?? 0) + 1)
  }
  const realCover = (image: string | undefined) =>
    image &&
    imageUses.get(image) === 1 &&
    !PLACEHOLDER_IMAGES.some((pattern) => pattern.test(image))
      ? image
      : undefined

  const ranked = unique
    .filter((item) => looksEnglish(item.headline))
    .map((item) => ({
      ...item,
      image: realCover(item.image),
      impact: item.tickers
        .map(exposureFor)
        .filter((e): e is Exposure => e !== undefined)
        .filter((e) => isAbout(item, e.symbol))
        .sort((a, b) => b.total - a.total),
    }))
    .filter((item) => item.impact.length > 0)
    .sort(newestFirst)

  return {
    items: pickDiverse(
      ranked.filter((item) => !isOpinion(item)),
      limit,
    ),
    hiddenOpinion: ranked.filter(isOpinion),
  }
}
