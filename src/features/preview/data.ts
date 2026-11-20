import type { LucideIcon } from "lucide-react"
import {
  ChartPieIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react"

import { illustrations, preview } from "@/features/landing/content"

import { PORTFOLIO_PATH, PREVIEW_PATH } from "./constants"

/**
 * Copy and simulated data for the dashboard preview. Nothing here is real or
 * investment advice. Numbers shared with the landing (portfolio total,
 * accounts, weekly movers, the NVDA rebalance) are imported from the landing
 * content so the two pages always agree.
 */

export const comingSoon = {
  title: "We're still building this",
  description: "Coming soon. As a waitlist member, you'll get early access.",
} as const

/**
 * Copy shared by the simulated actions (approve, switch mode, ask). Every
 * simulation ends by pointing back at the waitlist, never at a live product.
 */
export const demo = {
  simulated: "Simulated",
  reset: "Reset demo",
  waitlistNote:
    "In the real app, this runs at your broker. You'll get access when your invite is ready.",
} as const

export const welcome = {
  new: {
    title: "You're on the list.",
    description:
      "While we build, here's a preview of your Rocca dashboard. Everything here uses simulated data.",
  },
  back: {
    title: "Welcome back. You're already on the list.",
    description:
      "Here's a preview of your Rocca dashboard. Everything here uses simulated data.",
  },
  dismiss: "Dismiss",
} as const

/** Items with `href` are built pages; the rest show the coming-soon notice. */
export type NavItem = { label: string; icon: LucideIcon; href?: string }

export const shell = {
  badge: "Simulated preview · Not investment advice",
  backToSite: "Back to site",
  collapseMenu: "Collapse menu",
  expandMenu: "Expand menu",
  greeting: "Good morning",
  user: { name: "You", initials: "Y", plan: "Waitlist preview" },
  notifications: "Notifications",
  /** Tag on nav items that aren't built yet; screen readers hear `comingSoon`. */
  soon: "Soon",
  comingSoon: "coming soon",
  /** The search-like field in the top bar that opens the Ask panel. */
  askTrigger: {
    label: "Ask Rocca",
    placeholder: "Ask Rocca about your money…",
  },
  close: "Close",
  nav: [
    { label: "Overview", icon: LayoutDashboardIcon, href: PREVIEW_PATH },
    { label: "Portfolio", icon: ChartPieIcon, href: PORTFOLIO_PATH },
    { label: "Agent", icon: SparklesIcon },
    { label: "Learn", icon: GraduationCapIcon },
    { label: "Rules", icon: ShieldCheckIcon },
    { label: "Settings", icon: SettingsIcon },
  ] satisfies NavItem[],
} as const

/** At-a-glance status in the page header. */
export const status = {
  mode: "Mode",
  /** The overview's subtitle: how fresh the data is, and what's waiting. */
  data: "Simulated data",
  updated: "Updated just now",
  waiting: "1 decision waiting",
  clear: "Nothing waiting on you",
} as const

export const ask = {
  label: "Ask Rocca",
  description: "Plain English, no jargon.",
  /** A sample exchange so visitors see the tone of the answers. */
  sample: {
    label: "Example conversation",
    you: "You",
    question: "Why did my portfolio go up this week?",
    answer:
      "Mostly NVDA. It added $3,120 of your $4,390 gain. Your index funds simply moved with the market.",
    followUp: "Want me to explain why one stock doing this much matters?",
  },
  /** Field label; distinct from the section name so screen readers can tell them apart. */
  inputLabel: "Your question",
  placeholder: "Ask Rocca anything about your money…",
  submit: "Send",
  attach: "Attach a statement",
  /** Beginner mode: answers without jargon. */
  explainSimply: "Explain simply",
  hint: "Enter to send · Shift + Enter for a new line",
  /** Beginner-friendly prompts: the tone is "learn while Rocca handles it". */
  suggestions: [
    "What's a Roth IRA?",
    "Am I diversified enough?",
    "Why did my portfolio go up?",
  ],
  /** Canned answers for the suggestions, consistent with the simulated data. */
  answers: {
    "What's a Roth IRA?":
      "A retirement account you fund with money you've already paid tax on. In return, it grows tax-free and you can take it out tax-free after 59½. That's why Rocca put the NVDA trade there: selling inside it costs you $0 in tax.",
    "Am I diversified enough?":
      "Mostly, with one gap. NVDA is 18% of your holdings, and your index funds hold another 4.1% of it, so about 22% of your money rides on one company. Your rule caps a single stock at 12%. Everything else is spread across thousands of companies.",
    "Why did my portfolio go up?":
      "Mostly NVDA. It added $3,120 of your $4,390 gain this week. Your index funds simply moved with the market.",
  } as Record<string, string>,
  /** Any question without a canned answer. */
  fallback:
    "Good question. In the beta, Rocca answers anything about your accounts, using your real holdings. In this preview it only knows the three suggested questions.",
  thinking: "Rocca is typing…",
} as const

/** What Rocca can do at each account's broker (`illustrations.accounts[].access`). */
export const accountAccess = {
  trade: "Can trade",
  view: "View only",
} as const

/** How far apart two chart points are, for "12 days ago" while scrubbing. */
export type ChartStep = { unit: "day" | "week" | "month"; size: number }

export const portfolio = {
  title: "Total portfolio",
  description: "All your accounts, in one place.",
  viewAll: "View portfolio",
  value: preview.portfolio.value,
  weekChange: { amount: "+$4,390", label: preview.portfolio.change },
  byAccount: "By account",
  chart: {
    ranges: ["1W", "1M", "1Y", "All"],
    defaultRange: "1M",
    today: "Today",
    benchmark: {
      name: "S&P 500",
      toggle: "vs S&P 500",
      /** Shown in the legend: the benchmark line is made up like the rest. */
      note: "simulated",
    },
    /**
     * Closes per range, oldest first. Every series ends on today's total
     * ($248,310), and 1W starts at $243,920 so it matches "+$4,390 this week".
     * The change shown next to the chart is computed from these values.
     *
     * `benchmark` is what the same starting amount would be worth in the
     * S&P 500 (simulated), so both lines start together.
     */
    series: {
      "1W": {
        caption: "Past week",
        since: "1 week ago",
        step: { unit: "day", size: 1 },
        values: [
          243920, 244700, 245900, 245300, 246800, 247600, 247100, 248310,
        ],
        benchmark: [
          243920, 243500, 244580, 245210, 244830, 245310, 245360, 246120,
        ],
      },
      "1M": {
        caption: "Past month",
        since: "1 month ago",
        step: { unit: "day", size: 1 },
        values: [
          240120, 239480, 240950, 241700, 241050, 242300, 243100, 242600,
          243800, 244350, 243700, 242900, 243600, 244800, 245300, 244100,
          243500, 244200, 245100, 244600, 243400, 243920, 244700, 245900,
          245300, 246800, 247600, 247100, 248310,
        ],
        benchmark: [
          240120, 240320, 240520, 240310, 240270, 241470, 241780, 241310,
          241190, 241380, 241470, 241850, 241710, 242900, 242690, 243320,
          243340, 242570, 243420, 243010, 244240, 243850, 244040, 244190,
          244060, 243920, 244120, 245690, 245170,
        ],
      },
      "1Y": {
        caption: "Past year",
        since: "1 year ago",
        step: { unit: "week", size: 2 },
        // The dip in the middle is March (see the track record's misses).
        values: [
          217400, 219800, 222100, 220500, 224300, 226900, 225100, 228400,
          231200, 229800, 226300, 222900, 225600, 229100, 232400, 234900,
          233100, 236800, 239400, 238100, 241600, 240120, 243920, 248310,
        ],
        benchmark: [
          217400, 220010, 219900, 222040, 222310, 221850, 223080, 223540,
          225060, 227690, 227250, 226610, 230260, 229300, 231970, 232350,
          232670, 233030, 239100, 237760, 236340, 242310, 240330, 241750,
        ],
      },
      All: {
        caption: "All time",
        since: "5 years ago",
        step: { unit: "month", size: 3 },
        values: [
          162000, 158400, 166900, 171200, 168500, 176300, 181900, 179200,
          188600, 194100, 191300, 199800, 207500, 204200, 213900, 217400,
          226900, 231200, 222900, 234900, 241600, 248310,
        ],
        benchmark: [
          162000, 162390, 168220, 174810, 171210, 178150, 178770, 182030,
          187450, 185780, 193830, 196730, 193920, 196300, 200080, 207080,
          207930, 209800, 214820, 217870, 217420, 223560,
        ],
      },
    } satisfies Record<
      string,
      {
        caption: string
        /** Left end of the time axis. */
        since: string
        step: ChartStep
        values: number[]
        benchmark: number[]
      }
    >,
  },
  accounts: illustrations.accounts,
} as const

export const suggestion = {
  eyebrow: "Rocca suggests",
  /** Header of the decision card, with the count of pending decisions. */
  needsOk: "Needs your OK",
  title: "Trim NVDA from 18% back to 12%",
  summary:
    "NVDA grew faster than everything else you own. Bringing it back to your target means one stock can't swing your whole portfolio.",
  reasoningTitle: "How Rocca got here",
  reasoning: [
    {
      text: "NVDA is 18% of your holdings. Your rule says no single stock above 12%.",
      source: "Your rules",
    },
    {
      text: "Your index funds hold another 4.1% of NVDA that's easy to miss.",
      source: "Fund holdings",
    },
    {
      text: "Selling inside your Roth IRA owes no tax. The same sale in your brokerage would cost about $765.",
      source: "Tax lots",
    },
    {
      text: "Your Roth IRA is at E*TRADE, so Rocca can place this for you. Your Fidelity brokerage is view-only.",
      source: "Broker access",
    },
  ],
  order: preview.order,
  taxSmart: { label: "Tax-smart placement", ...preview.order.taxSmart },
  askWhy: "Ask why",
  /** The before/after bar in the decision card. */
  effect: {
    label: "NVDA in your portfolio",
    from: 0.18,
    to: 0.12,
    limit: 0.12,
    limitLabel: "Your limit",
    /** Full width of the bar, so 18% leaves room on the right. */
    scale: 0.25,
  },
  review: "Review reasoning",
  reviewTitle: "Why Rocca suggests this",
  /** Rows under the order: what it costs, which rule, where it runs. */
  impact: {
    tax: "Tax",
    rule: "Rule",
    ruleValue: "No single stock above 12%",
    account: "Account",
    accountValue: "E*TRADE Roth IRA",
  },
  lesson: "New to rebalancing? 2-min lesson",
  decisionNote: "Nothing happens until you approve.",
  /** Shown instead of `decisionNote` while the mode is Autopilot. */
  autopilotNote:
    "On Autopilot, Rocca would do this within your rules and tell you right after.",
  placing: "Placing both orders in your E*TRADE Roth IRA…",
  receipt: {
    eyebrow: "Simulated receipt",
    title: "Done. NVDA is back to 12%.",
    rule: "Your 12% rule is on track again.",
  },
  skipped: {
    title: "Skipped for now",
    description:
      "Rocca will check NVDA again tomorrow and tell you if anything changes.",
  },
  next: {
    title: "If you approve",
    steps: [
      "Rocca places both orders in your E*TRADE Roth IRA",
      "You get a receipt with every detail",
      "Your plan and rules update right away",
    ],
  },
} as const

export const autonomy = {
  title: "How much Rocca handles",
  description: "Start small. Hand over more as you learn.",
  levels: [
    {
      id: "explain",
      short: "Explain",
      label: "Explain only",
      description: "Rocca watches and teaches. You make every move.",
    },
    {
      id: "approve",
      short: "Suggest",
      label: "Suggest, I approve",
      description: "Rocca proposes trades. Nothing runs without your OK.",
    },
    {
      id: "autopilot",
      short: "Autopilot",
      label: "Autopilot",
      description: "Rocca acts within your rules and tells you right after.",
      /** Not at launch: shown with `autonomy.later`. */
      later: true,
    },
  ],
  /** Tag and note for levels that arrive after launch. */
  later: {
    tag: "Later",
    note: "Comes after launch, at brokers that allow it.",
  },
  current: "approve",
  /** What each side does, per level (keyed by level id). */
  inThisMode: {
    title: "In this mode",
    labels: { rocca: "Rocca", you: "You" },
    byLevel: {
      explain: {
        rocca: ["Watches every account, 24/7", "Explains what moved and why"],
        you: ["Make every trade yourself"],
      },
      approve: {
        rocca: [
          "Watches every account, 24/7",
          "Proposes trades and explains why",
        ],
        you: ["Approve or skip every trade"],
      },
      autopilot: {
        rocca: ["Trades within your rules", "Tells you right after"],
        you: ["Set the rules, review the receipts"],
      },
    },
  },
  change: "Switch to",
} as const

export type RuleStatus = "ok" | "attention"

export const rules = {
  title: "Your rules",
  description: "Rocca checks every move against these.",
  attentionCount: "1 needs attention",
  allClear: "All on track",
  items: [
    {
      label: "No single stock above 12%",
      detail: "NVDA is at 18%",
      status: "attention",
      /** Once the simulated rebalance is approved, the rule is back on track. */
      resolvedDetail: "NVDA is back at 12%",
    },
    { label: "Crypto stays under 10%", detail: "7.1% today", status: "ok" },
    {
      label: "Keep $10,000 for emergencies",
      detail: "$18,400 in cash",
      status: "ok",
    },
    {
      label: "No trades during earnings week",
      detail: "Next: NVDA on Wednesday",
      status: "ok",
    },
  ] satisfies {
    label: string
    detail: string
    status: RuleStatus
    resolvedDetail?: string
  }[],
  add: "Add a rule",
} as const

export const learn = {
  title: "Learn as you go",
  description: "Lessons picked from what's in your portfolio.",
  // Same lesson the landing's Learn card shows.
  progress: illustrations.learn.progress,
  next: { ...illustrations.learn.next, cta: "Start lesson" },
  progressLabel: "lessons done",
  conceptsLabel: "Concepts in your portfolio",
  concepts: [
    { label: "Rebalancing", done: true },
    { label: "Roth IRA", done: true },
    { label: "Expense ratio", done: true },
    { label: "Tax-loss harvesting", done: false },
  ],
  learned: "learned",
} as const

export const moves = {
  title: "What moved this week",
  change: preview.portfolio.change,
  items: illustrations.moves.items,
  explanation:
    "NVDA led your gains. Your index funds moved with the market. The only thing that needs a decision is NVDA's size.",
  upcomingTitle: "Coming up",
  upcoming: [
    { label: "NVDA earnings", when: "Wed" },
    { label: "Fed rate decision", when: "Next week" },
  ],
} as const

export const savings = {
  title: "Money you could keep",
  description: "Found across all your accounts.",
  total: "$912",
  per: "per year",
  items: [
    {
      label: "High-fee funds",
      detail: "Two funds charge 0.85%. Similar index funds charge 0.03%.",
      amount: "$385",
    },
    {
      label: "Idle cash",
      detail: "$8,400 above your emergency cushion earns 0.01%.",
      amount: "$378",
    },
    {
      label: "Tax-loss harvesting",
      detail: "Selling a losing position can offset this year's gains.",
      amount: "$149",
    },
  ],
  cta: "Review savings",
} as const

export const trackRecord = {
  title: "Rocca's track record with you",
  description: "Every call, including the misses.",
  stats: [
    { label: "Suggestions", value: "14" },
    { label: "You approved", value: "9" },
    {
      label: "Net impact",
      value: "+$1,840",
      hint: "vs. doing nothing, after taxes and fees",
    },
  ],
  missesTitle: "Calls that didn't work",
  misses: [
    { label: "Added VTI before the March dip", impact: "−$320" },
    { label: "Held AAPL into earnings", impact: "−$145" },
  ],
  cta: "See full history",
} as const

/** Copy for the phone layout (native-app style: tab bar, sheets, carousels). */
export const mobile = {
  tabs: {
    label: "App",
    home: "Home",
    portfolio: "Portfolio",
    ask: "Ask",
    learn: "Learn",
    more: "More",
  },
  menu: { title: "Menu", backToSite: "Back to site" },
  appBar: { notifications: "Notifications" },
  close: "Close",
  hero: {
    label: "Total portfolio",
    simulated: "Simulated preview · Not investment advice",
  },
  askBar: "Ask Rocca anything…",
  sections: {
    decision: "Needs your OK",
    controls: "Your controls",
    forYou: "For you",
    moves: "What moved this week",
    news: "In the news",
  },
  decision: { why: "Why?", whyTitle: "Why Rocca suggests this" },
  controls: {
    mode: "Mode",
    rules: "Rules",
    needsAttention: "needs attention",
  },
  forYou: {
    savingsCta: "Review savings",
    trackSummary: "vs. doing nothing, after taxes and fees",
    trackCta: "See full history",
    approvedOf: "approved of",
    misses: "misses shown",
  },
  portfolioViews: {
    label: "Portfolio sections",
    overview: "Overview",
    holdings: "Holdings",
    accounts: "Accounts",
  },
} as const

/**
 * First-visit tour. Each step lists the ids it can point at, desktop first
 * then phone; the tour picks whichever is visible (both layouts are
 * rendered and CSS hides one).
 */
export const tour = {
  label: "Quick tour",
  next: "Next",
  back: "Back",
  done: "Got it",
  skip: "Skip tour",
  steps: [
    {
      targets: ["suggestion", "m-suggestion"],
      title: "This needs your OK",
      body: "Rocca spotted something and shows its reasoning. Try Approve: it's a simulation, so nothing real happens.",
    },
    {
      targets: ["autonomy", "m-controls"],
      title: "You choose how much Rocca handles",
      body: "Start with suggestions you approve. Switch modes to see what changes.",
    },
    {
      targets: ["ask", "m-ask"],
      title: "Ask anything, in plain English",
      body: "Open Ask Rocca from any page, then pick a suggested question to see how it answers.",
    },
  ],
} as const
