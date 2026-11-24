import type { LucideIcon } from "lucide-react"
import {
  ChartPieIcon,
  PercentIcon,
  PiggyBankIcon,
  ScaleIcon,
  TrendingDownIcon,
} from "lucide-react"

import { illustrations } from "@/features/landing/content"

import { savings } from "../data"
import { formatPercent, formatUsd } from "../format"
import { allocation, holdings, portfolioTotal } from "../portfolio/data"
import { lossIfDrop, nvdaShare } from "./math"

/**
 * The course Rocca builds from what you own, and the one lesson the preview
 * plays end to end (Concentration). Every concept is tied to a holding or
 * account in the simulated portfolio, and says what learning it lets Rocca
 * handle for you: that's the "earned autonomy" idea, in data.
 */

export type ConceptId =
  | "concentration"
  | "rebalancing"
  | "tax-loss-harvesting"
  | "expense-ratio"
  | "roth-ira"

export type Concept = {
  id: ConceptId
  label: string
  /** The lesson's title. */
  title: string
  icon: LucideIcon
  /** Where it comes from in the portfolio, short: shown on the course path. */
  source: { label: string; detail: string }
  /** The same, as a sentence. */
  tie: string
  /** What learning it lets Rocca take on. */
  unlocks: string
  minutes: number
  /** Only Concentration is built; the others show the coming-soon notice. */
  playable: boolean
}

const usStocks = allocation.find((row) => row.assetClass === "US stocks")!
const thematic = holdings.find((h) => h.name === "Thematic Tech ETF")!
const thematicDrop = formatPercent(Math.abs(thematic.gain!))
const roth = illustrations.accounts.find((a) => a.name === "Roth IRA")!
const savingFor = (label: string) =>
  savings.items.find((item) => item.label === label)!.amount
const percent = (fraction: number) => formatPercent(fraction, { digits: 0 })

/** "22%": NVDA held directly plus inside your funds. */
export const nvdaTotalLabel = percent(nvdaShare.total)

/** The quick check's numbers: a 30% drop in NVDA, on the whole portfolio. */
const checkDrop = 0.3
const checkLoss = lossIfDrop(checkDrop)
/** "6.6%". */
export const checkLossShare = formatPercent(checkLoss / portfolioTotal)

/**
 * The course, in the order it's taught: what you really own first, then
 * what it costs you. The first one not learned is "up next".
 */
export const concepts = [
  {
    id: "concentration",
    label: "Concentration",
    title: illustrations.learn.next.title,
    icon: ChartPieIcon,
    source: { label: "NVDA", detail: `${nvdaTotalLabel} of your money` },
    tie: `NVDA is ${nvdaTotalLabel} of your money`,
    unlocks: "Autopilot for your 12% rule",
    minutes: 2,
    playable: true,
  },
  {
    id: "rebalancing",
    label: "Rebalancing",
    title: "Getting back to the mix you chose",
    icon: ScaleIcon,
    source: {
      label: "US stocks",
      detail: `${percent(usStocks.share)} vs. ${percent(usStocks.target)} target`,
    },
    tie: `US stocks are ${percent(usStocks.share)} of your money; your target is ${percent(usStocks.target)}`,
    unlocks: "Autopilot for your target mix",
    minutes: 2,
    playable: false,
  },
  {
    id: "expense-ratio",
    label: "Expense ratio",
    title: "What a 0.85% fee costs you",
    icon: PercentIcon,
    source: { label: "2 funds", detail: "0.85% a year in fees" },
    tie: `Two of your funds charge 0.85%: ${savingFor("High-fee funds")} a year`,
    unlocks: "Rocca swaps to cheaper funds, with your OK",
    minutes: 2,
    playable: false,
  },
  {
    id: "tax-loss-harvesting",
    label: "Tax-loss harvesting",
    title: "Turning a loss into a tax break",
    icon: TrendingDownIcon,
    source: { label: "Thematic Tech ETF", detail: `down ${thematicDrop}` },
    tie: `Thematic Tech ETF is down ${thematicDrop}: about ${savingFor("Tax-loss harvesting")} off this year's taxes`,
    unlocks: "Autopilot for tax-loss harvesting",
    minutes: 2,
    playable: false,
  },
  {
    id: "roth-ira",
    label: "Roth IRA",
    title: "What your Roth IRA is for",
    icon: PiggyBankIcon,
    source: { label: roth.institution, detail: `Roth IRA · ${roth.value}` },
    tie: `Your ${roth.institution} Roth IRA, ${roth.value}`,
    unlocks: "Rocca picks the cheapest account for each trade",
    minutes: 2,
    playable: false,
  },
] as const satisfies readonly Concept[]

/** The course path, Duolingo-style: two units, each a stretch of lessons. */
export const units = [
  {
    id: "what-you-own",
    title: "What you really own",
    description: "Where your money sits, starting with NVDA.",
    tone: "learn",
    concepts: ["concentration", "rebalancing"],
  },
  {
    id: "what-it-costs",
    title: "What it costs you",
    description: "Fees and taxes hiding across your accounts.",
    tone: "brand",
    concepts: ["expense-ratio", "tax-loss-harvesting", "roth-ira"],
  },
] as const satisfies readonly {
  id: string
  title: string
  description: string
  tone: "learn" | "brand"
  concepts: readonly ConceptId[]
}[]

/** The lesson the dashboard opens from the decision and the Learn pages. */
export const LESSON_ID = "concentration" satisfies ConceptId

/**
 * What the regular preview (someone who's been using Rocca) has already
 * learned: the same three concepts it always showed as done.
 */
export const DEFAULT_LEARNED: readonly ConceptId[] = [
  "rebalancing",
  "roth-ira",
  "expense-ratio",
]

export function conceptById(id: ConceptId) {
  return concepts.find((concept) => concept.id === id)!
}

/** Copy of the Concentration lesson. Numbers are filled in by the lesson. */
export const lesson = {
  eyebrow: "2-min lesson",
  description: "Built from your own portfolio",
  stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
  back: "Back",
  next: "Next",
  close: "Back to the decision",
  steps: {
    exposure: {
      title: `One company, ${nvdaTotalLabel} of your money`,
      body: `You own NVIDIA directly in two accounts, and your index funds hold more of it. Together, about ${nvdaTotalLabel.replace("%", "")} cents of every dollar you have rides on one company.`,
      definition:
        "Concentration means a big share of your money depends on one company. The bigger that share, the more one company's bad year becomes your bad year.",
      direct: "You own directly",
      viaFunds: "Inside your funds",
      brokers:
        "Concentration can hide: each account looks fine on its own, and index funds own some of the same companies you do.",
    },
    whatIf: {
      title: "What if NVDA drops?",
      body: "One company can fall fast. Move the slider to see what a drop would cost you today.",
      slider: "How much NVDA drops",
      youLose: "You'd lose",
      ofEverything: "of everything you own",
      atLimit: "With NVDA at your 12% limit",
      takeaway: "Spreading the money out makes every drop smaller.",
    },
    rebalance: {
      title: "Rebalancing brings it back",
      body: "Rebalancing means selling a bit of what grew too big and buying what fell behind. For you, that's one sale and one buy:",
      before: "NVDA now",
      after: "After the trim",
      takeaway:
        "The money doesn't leave your portfolio. It moves into a fund that holds thousands of companies.",
    },
    tax: {
      title: "Where you sell matters",
      body: "Same trade, different account. Selling inside a Roth IRA owes no tax. In a regular brokerage account, the gain is taxed.",
      roth: "Your Roth IRA",
      rothNote: "Growth in a Roth is never taxed",
      brokerage: "Your brokerage",
      brokerageNote: (gain: string) => `About ${gain} of gain, taxed`,
      takeaway:
        "Before you sell, check which account it's in. The same trade can cost very different amounts in tax.",
      assumption:
        "Estimate, assuming a 15% long-term capital gains rate. Your rate may differ.",
    },
    check: {
      title: "Quick check",
      /** Tests the concept, with your own numbers. */
      question: `NVDA is about ${nvdaTotalLabel} of your money. If NVDA fell ${percent(checkDrop)} tomorrow, about how much would your whole portfolio fall?`,
      options: [
        {
          id: "same",
          label: `${percent(checkDrop)}, the same as NVDA`,
          feedback: `Not quite. Only the money you have in NVDA falls ${percent(checkDrop)}. The rest of your portfolio doesn't move with it.`,
        },
        {
          id: "share",
          label: `About ${checkLossShare}: ${percent(checkDrop)} of the ${nvdaTotalLabel} you have in NVDA`,
          feedback: `Exactly. That's about ${formatUsd(checkLoss)}. The bigger one company's share, the bigger that number gets.`,
          correct: true,
        },
        {
          id: "nothing",
          label: "Nothing, because my index funds protect me",
          feedback:
            "Not quite. Your index funds own NVDA too, so they'd drop a little with it.",
        },
      ],
      learned: "Concept learned: Concentration",
      unlock:
        "Next: approve this trim once to unlock Autopilot for your 12% rule.",
    },
  },
} as const

/** The /preview/learn page: the course path. */
export const learnPage = {
  badge: "Built from your portfolio",
  title: (name: string | null) => (name ? `${name}'s course` : "Your course"),
  intro:
    "Rocca read your accounts and turned what it found into short lessons. Each one starts from something you own, with your own numbers.",
  pipeline: {
    label: "How your course was built",
    accounts: "accounts read",
    holdings: "holdings checked",
    lessons: "lessons for you",
  },
  minutes: (minutes: number) => `About ${minutes} min`,
  streak: (days: number) =>
    days > 0 ? `${days}-day streak` : "Start your streak today",
  path: "Course path",
  unit: (n: number) => `Unit ${n}`,
  lessonOf: (n: number, total: number, minutes: number) =>
    `Lesson ${n} of ${total} · ${minutes} min`,
  bubble: { start: "Start", next: "Up next" },
  status: { learned: "Learned", next: "Up next", notStarted: "Not started" },
  tie: "From your portfolio",
  unlocks: "Unlocks",
  start: "Start lesson",
  review: "Review lesson",
  level: {
    label: (level: number) => `Level ${level}`,
    xp: (xp: number) => `${xp} XP`,
    toNext: (xp: number, level: number) => `${xp} XP to Level ${level}`,
    max: "Top level: you're in control",
  },
  week: {
    title: "Your streak",
    goal: "Today's goal: 1 lesson",
    goalDone: "Today's goal: done",
    today: "Today",
    done: "lesson done",
    missed: "no lesson",
  },
  achievements: {
    title: "Achievements",
    count: (done: number, total: number) => `${done} of ${total}`,
    earned: "Earned",
    locked: "Not yet",
  },
  trophy: {
    label: (unit: number) => `Unit ${unit} trophy`,
    hint: (badge: string) => `Finish the unit to earn "${badge}"`,
    earned: (badge: string) => `Earned "${badge}"`,
  },
  /** On the lesson's last step, when the quick check is right. */
  celebrate: {
    xp: (xp: number) => `+${xp} XP`,
    streak: (days: number) => `${days}-day streak`,
  },
  progress: {
    title: "Your progress",
    lessons: (done: number, total: number) => `${done} of ${total} lessons`,
    left: (minutes: number) =>
      minutes > 0 ? `About ${minutes} min to go` : "Course complete",
    next: "Up next",
  },
  rewards: {
    title: "What learning unlocks",
    description:
      "Your rewards are real: each lesson lets Rocca take on one more thing for you. You can turn any of it off.",
    locked: (label: string) => `Learn ${label} to unlock`,
    unlocked: "Unlocked",
    /** The 12% rule also needs one approved trim (see the Autopilot rule). */
    needsApproval: "Approve one trim to finish",
    ready: "Ready to turn on",
    on: "On",
  },
} as const
