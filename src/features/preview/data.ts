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
  greeting: "Good morning",
  subtitle: "Here's what your agent is watching today.",
  user: { name: "You", initials: "Y" },
  nav: [
    { label: "Overview", icon: LayoutDashboardIcon, href: PREVIEW_PATH },
    { label: "Portfolio", icon: ChartPieIcon, href: PORTFOLIO_PATH },
    { label: "Agent", icon: SparklesIcon },
    { label: "Learn", icon: GraduationCapIcon },
    { label: "Rules", icon: ShieldCheckIcon },
    { label: "Settings", icon: SettingsIcon },
  ] satisfies NavItem[],
} as const

/** The overview is split in three zones, most important first. */
export const sections = {
  attention: "Needs your OK",
  learn: "Learn & ask",
  money: "Your money",
} as const

/** At-a-glance status in the page header. */
export const status = {
  mode: "Mode",
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
  voice: "Ask by voice",
  /** Beginner mode: answers without jargon. */
  explainSimply: "Explain simply",
  hint: "Enter to send · Shift + Enter for a new line",
  /** Beginner-friendly prompts: the tone is "learn while Rocca handles it". */
  suggestions: [
    "What's a Roth IRA?",
    "Am I diversified enough?",
    "Why did my portfolio go up?",
  ],
} as const

export const portfolio = {
  title: "Your portfolio",
  description: "All your accounts, in one place.",
  viewAll: "View portfolio",
  value: preview.portfolio.value,
  weekChange: { amount: "+$4,390", label: preview.portfolio.change },
  chart: {
    caption: "Past month",
    change: "+3.4%",
    ranges: ["1W", "1M", "1Y", "All"],
    activeRange: "1M",
    /** Daily closes, oldest first; the last value is today's total. */
    values: [
      240120, 239480, 240950, 241700, 241050, 242300, 243100, 242600, 243800,
      244350, 243700, 242900, 243600, 244800, 245300, 244100, 243500, 244200,
      245100, 244600, 243400, 243920, 244700, 245900, 245300, 246800, 247600,
      247100, 248310,
    ],
  },
  accounts: illustrations.accounts,
} as const

export const suggestion = {
  eyebrow: "Rocca suggests",
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
  ],
  order: preview.order,
  taxSmart: { label: "Tax-smart placement", ...preview.order.taxSmart },
  askWhy: "Ask why",
  lesson: "New to rebalancing? 2-min lesson",
  decisionNote: "Nothing happens until you approve.",
  next: {
    title: "If you approve",
    steps: [
      "Rocca places both orders in your Roth IRA",
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
    },
  ],
  current: "approve",
  inThisMode: {
    title: "In this mode",
    rocca: {
      label: "Rocca",
      items: [
        "Watches every account, 24/7",
        "Proposes trades and explains why",
      ],
    },
    you: { label: "You", items: ["Approve or skip every trade"] },
  },
  change: "Switch to",
} as const

export type RuleStatus = "ok" | "attention"

export const rules = {
  title: "Your rules",
  description: "Rocca checks every move against these.",
  attentionCount: "1 needs attention",
  items: [
    {
      label: "No single stock above 12%",
      detail: "NVDA is at 18%",
      status: "attention",
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
  ] satisfies { label: string; detail: string; status: RuleStatus }[],
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
    { label: "Net impact", value: "+$1,840", hint: "vs. doing nothing" },
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
  },
  decision: { why: "Why?", whyTitle: "Why Rocca suggests this" },
  controls: {
    mode: "Mode",
    rules: "Rules",
    needsAttention: "needs attention",
  },
  forYou: {
    savingsCta: "Review savings",
    trackSummary: "vs. doing nothing",
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
