import type { LucideIcon } from "lucide-react"
import {
  CircleAlertIcon,
  CoinsIcon,
  LightbulbIcon,
  ReceiptIcon,
  ScaleIcon,
  LayersIcon,
} from "lucide-react"

import { illustrations } from "@/features/landing/content"

import { PREVIEW_PATH } from "../constants"

/**
 * Simulated portfolio for the preview's Portfolio page. Holdings are stored
 * per account, and everything else (weights, allocation, account totals,
 * total gain) is derived from them, so the numbers can't drift apart. The
 * account totals match the landing (`illustrations.accounts`); a test checks it.
 *
 * Well-known tickers are used for realism. The two high-fee funds are
 * made-up names on purpose, so no real fund is tied to an invented fee.
 */

export type AccountName = (typeof illustrations.accounts)[number]["name"]

export type AssetClass =
  "US stocks" | "International" | "Bonds" | "Crypto" | "Cash"

export type Holding = {
  /** Ticker for well-known assets; omitted for the made-up funds. */
  symbol?: string
  name: string
  kind: "Stock" | "Fund" | "Crypto" | "Cash"
  assetClass: AssetClass
  /** Dollar value held in each account. */
  positions: Partial<Record<AccountName, number>>
  /** Return since purchase as a fraction (0.12 = +12%). Cash has none. */
  gain?: number
}

export const holdings: Holding[] = [
  {
    symbol: "VTI",
    name: "Total US Stock Market ETF",
    kind: "Fund",
    assetClass: "US stocks",
    positions: { Brokerage: 40000, "Roth IRA": 12140 },
    gain: 0.214,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    kind: "Stock",
    assetClass: "US stocks",
    positions: { Brokerage: 28690, "Roth IRA": 16006 },
    gain: 0.519,
  },
  {
    name: "Active Growth Fund",
    kind: "Fund",
    assetClass: "US stocks",
    positions: { "401(k)": 39512 },
    gain: 0.138,
  },
  {
    symbol: "VXUS",
    name: "Total International Stock ETF",
    kind: "Fund",
    assetClass: "International",
    positions: { Brokerage: 17185, "Roth IRA": 5165 },
    gain: 0.082,
  },
  {
    name: "Cash",
    kind: "Cash",
    assetClass: "Cash",
    positions: { Brokerage: 18400 },
  },
  {
    symbol: "BND",
    name: "Total Bond Market ETF",
    kind: "Fund",
    assetClass: "Bonds",
    positions: { "Roth IRA": 14900 },
    gain: 0.021,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    kind: "Crypto",
    assetClass: "Crypto",
    positions: { Crypto: 12400 },
    gain: 0.35,
  },
  {
    symbol: "QQQ",
    name: "Nasdaq-100 ETF",
    kind: "Fund",
    assetClass: "US stocks",
    positions: { Brokerage: 12305 },
    gain: 0.19,
  },
  {
    symbol: "AAPL",
    name: "Apple",
    kind: "Stock",
    assetClass: "US stocks",
    positions: { Brokerage: 9930 },
    gain: 0.24,
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    kind: "Stock",
    assetClass: "US stocks",
    positions: { Brokerage: 8920 },
    gain: 0.17,
  },
  {
    name: "Thematic Tech ETF",
    kind: "Fund",
    assetClass: "US stocks",
    positions: { Brokerage: 7450 },
    gain: -0.098,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    kind: "Crypto",
    assetClass: "Crypto",
    positions: { Crypto: 5307 },
    gain: -0.075,
  },
]

// ---- Derived numbers -------------------------------------------------------

export function holdingValue(holding: Holding) {
  return Object.values(holding.positions).reduce(
    (sum, value) => sum + (value ?? 0),
    0,
  )
}

export const portfolioTotal = holdings.reduce(
  (sum, holding) => sum + holdingValue(holding),
  0,
)

/** Dollar gain since purchase (value minus cost basis). */
export function holdingGain(holding: Holding) {
  if (holding.gain === undefined) return 0
  const value = holdingValue(holding)
  return value - value / (1 + holding.gain)
}

export const totalGain = holdings.reduce((sum, h) => sum + holdingGain(h), 0)
export const totalGainPercent = totalGain / (portfolioTotal - totalGain)

export function accountTotal(account: AccountName) {
  return holdings.reduce((sum, h) => sum + (h.positions[account] ?? 0), 0)
}

/** Targets the user set; they add up to 100%. */
export const allocationTargets: Record<AssetClass, number> = {
  "US stocks": 0.6,
  International: 0.2,
  Bonds: 0.1,
  Crypto: 0.05,
  Cash: 0.05,
}

export const allocation = (Object.keys(allocationTargets) as AssetClass[]).map(
  (assetClass) => {
    const value = holdings
      .filter((h) => h.assetClass === assetClass)
      .reduce((sum, h) => sum + holdingValue(h), 0)
    return {
      assetClass,
      value,
      share: value / portfolioTotal,
      target: allocationTargets[assetClass],
    }
  },
)

// ---- Copy ------------------------------------------------------------------

export const page = {
  title: "Portfolio",
  subtitle: "Everything you own, across all your accounts.",
  connect: "Connect account",
} as const

/**
 * The simulated "Connect account" sheet: which brokers let Rocca place
 * trades and which only share data. Picking one shows the coming-soon notice.
 */
export const connectCopy = {
  title: "Connect an account",
  description:
    "Rocca links through established brokerage-data providers and never sees your password.",
  groups: [
    {
      access: "trade",
      title: "View and trade",
      description: "Rocca can place the trades you approve.",
      institutions: [
        "E*TRADE",
        "Webull",
        "Public",
        "tastytrade",
        "Coinbase",
        "Kraken",
      ],
    },
    {
      access: "view",
      title: "View only",
      description:
        "Rocca prepares the order. You place it in your broker's app.",
      institutions: [
        "Fidelity",
        "Charles Schwab",
        "Vanguard",
        "Robinhood",
        "Interactive Brokers",
        "Empower",
      ],
    },
  ],
  note: "Support depends on each broker and can change. Names are for illustration only; Rocca isn't affiliated with these companies.",
} as const

export const kpis = {
  value: { label: "Total value", delta: "+1.8%", hint: "this week" },
  gain: { label: "Total gain", hint: "since you started" },
  dividends: {
    label: "Est. dividends",
    value: 3180,
    hint: "per year · 1.3% yield",
  },
  cash: { label: "Cash", hint: "of your portfolio" },
} as const

export const allocationCopy = {
  title: "Allocation",
  description: "What you own vs. the targets you set.",
  target: "Target",
  /** Gap (in share of the portfolio) that counts as off target. */
  tolerance: 0.03,
  points: "pts",
  over: "over",
  under: "under",
  onTarget: "On target",
} as const

export const exposure = {
  title: "What you really own",
  description:
    "Your funds hold stocks too. This is your total exposure, direct and through funds.",
  legend: { direct: "You own directly", viaFunds: "Through your funds" },
  items: [
    { symbol: "NVDA", direct: 0.18, viaFunds: 0.041 },
    { symbol: "AAPL", direct: 0.04, viaFunds: 0.026 },
    { symbol: "MSFT", direct: 0.036, viaFunds: 0.029 },
    { symbol: "AMZN", direct: 0, viaFunds: 0.021 },
    { symbol: "GOOGL", direct: 0, viaFunds: 0.018 },
  ],
} as const

export const accountsCopy = {
  title: "Accounts",
  description: "Where your money lives, and how each one is taxed.",
  details: {
    Brokerage: { tax: "Taxable", ytd: 0.094 },
    "Roth IRA": { tax: "Tax-free growth", ytd: 0.112 },
    "401(k)": { tax: "Tax-deferred", ytd: 0.081 },
    Crypto: { tax: "Taxable", ytd: 0.215 },
  } satisfies Record<AccountName, { tax: string; ytd: number }>,
  ytd: "this year",
  holding: "holding",
  holdings: "holdings",
} as const

export const holdingsCopy = {
  title: "Holdings",
  filters: ["All", "Stocks", "Funds", "Crypto", "Cash"],
  columns: {
    asset: "Asset",
    accounts: "Accounts",
    value: "Value",
    weight: "Weight",
    gain: "Return",
  },
} as const

export type InsightTone = "attention" | "opportunity" | "good"

export type Insight = {
  id: string
  tone: InsightTone
  tag: string
  icon: LucideIcon
  title: string
  body: string
  /** A real link inside the preview, or a lesson (coming soon). */
  action: { label: string; href: string } | { lesson: string }
}

export const insightsCopy = {
  title: "What Rocca sees",
  description: "Found by looking across all your accounts at once.",
}

export const insights: Insight[] = [
  {
    id: "concentration",
    tone: "attention",
    tag: "Risk",
    icon: CircleAlertIcon,
    title: "NVDA is 22% of what you really own",
    body: "18% directly, plus 4.1% inside your funds. Your rule caps any single stock at 12%.",
    action: {
      label: "See Rocca's suggestion",
      href: `${PREVIEW_PATH}#suggestion`,
    },
  },
  {
    id: "balance",
    tone: "attention",
    tag: "Balance",
    icon: ScaleIcon,
    title: "70% in US stocks. Your target is 60%.",
    body: "Most of the extra comes from NVDA's run. International is 9%, below your 20% target.",
    action: { lesson: "What's asset allocation?" },
  },
  {
    id: "overlap",
    tone: "opportunity",
    tag: "Overlap",
    icon: LayersIcon,
    title: "QQQ mostly repeats what VTI already holds",
    body: "Most of QQQ's biggest holdings are already inside VTI, so it adds less variety than it seems.",
    action: { lesson: "What is fund overlap?" },
  },
  {
    id: "fees",
    tone: "opportunity",
    tag: "Fees",
    icon: ReceiptIcon,
    title: "Two funds cost you about $385 a year",
    body: "Active Growth Fund and Thematic Tech ETF charge 0.85%. Similar index funds charge 0.03%.",
    action: { lesson: "How fees add up over time" },
  },
  {
    id: "taxes",
    tone: "opportunity",
    tag: "Taxes",
    icon: LightbulbIcon,
    title: "$1,240 in losses you could put to work",
    body: "Thematic Tech ETF and ETH are down. Selling them could lower this year's taxes by about $149.",
    action: { lesson: "What's tax-loss harvesting?" },
  },
  {
    id: "dividends",
    tone: "good",
    tag: "Income",
    icon: CoinsIcon,
    title: "On track for $3,180 in dividends",
    body: "About $265 a month, reinvested automatically.",
    action: { lesson: "How dividends grow your money" },
  },
]
