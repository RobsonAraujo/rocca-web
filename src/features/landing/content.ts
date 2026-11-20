import type { LucideIcon } from "lucide-react"
import {
  ChartLineIcon,
  GraduationCapIcon,
  LandmarkIcon,
  LayersIcon,
  MessageSquareTextIcon,
  ShieldCheckIcon,
} from "lucide-react"

/**
 * All landing page copy lives here so marketing changes (and a future i18n
 * pass) never require touching component markup.
 */

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
] as const

export const hero = {
  eyebrow: "Early access · Join the waitlist",
  title: "Invest with an agent that never sleeps.",
  /** Part of `title` the hero highlights in the brand color. */
  emphasis: "never sleeps.",
  description:
    "Rocca sees across your brokerage, retirement and crypto accounts, explains every move in plain English, and turns ideas into trades on your terms. New to investing? You'll learn as you go.",
  /** Shown under both waitlist forms: the instant preview is the signup incentive. */
  note: "No spam. Join and get instant access to a preview of your dashboard.",
} as const

/** Short promises, restating what the FAQ answers in detail. */
export const principles = [
  { icon: ShieldCheckIcon, label: "By default, nothing runs without your OK" },
  { icon: LandmarkIcon, label: "Your money stays at your broker" },
  {
    icon: MessageSquareTextIcon,
    label: "Every move explained in plain English",
  },
] satisfies { icon: LucideIcon; label: string }[]

export const preview = {
  label: "Simulated",
  portfolio: { value: "$248,310.42", change: "+1.8% this week" },
  messages: [
    "Good morning. Your portfolio is up 1.8% this week. NVDA drove most of it and is now 18% of your holdings, above your 12% target.",
    "Want me to trim it back to 12% and move the difference into your index fund?",
  ],
  order: {
    title: "Proposed rebalance",
    lines: [
      // Sized to bring NVDA from 18% to 12% of $248,310 (about $14.9k).
      { side: "Sell", detail: "84 NVDA", amount: "$14,868" },
      { side: "Buy", detail: "50 VTI", amount: "$14,850" },
    ],
    approve: "Approve",
    dismiss: "Not now",
    /** Where Rocca would place the trade, and what that saves in taxes. */
    taxSmart: {
      account: "Roth IRA",
      estimate: "Est. tax $0",
      comparison: "vs. ~$765 in your brokerage",
    },
  },
} as const

/**
 * The news section right under the hero. Visitors haven't connected an
 * account, so it's about the market, not "your money". The card itself says
 * whether its headlines are live or simulated.
 */
export const liveNews = {
  eyebrow: "In the news",
  title: "We're watching what's happening around the world.",
  description:
    "Headlines on the companies that move the market, with the hot takes filtered out. Connect your accounts and Rocca shows how each story touches your money.",
  cta: "See what it means for your portfolio",
} as const

/** Stable key per feature, so a layout can attach visuals without relying on order. */
export type FeatureId = "accounts" | "moves" | "approval" | "learn"

export type Feature = {
  id: FeatureId
  icon: LucideIcon
  title: string
  description: string
}

export const features = {
  eyebrow: "What Rocca does",
  title:
    "Your broker's AI only sees your broker. Rocca sees the whole picture.",
  items: [
    {
      id: "accounts",
      icon: LayersIcon,
      title: "Every account, one view",
      description:
        "Link your brokerage, retirement and crypto accounts once, with secure connections. Rocca keeps an up-to-date picture of everything you own.",
    },
    {
      id: "moves",
      icon: ChartLineIcon,
      title: "Know why it moved",
      description:
        "A plain-English brief every morning on what changed and why, and a heads-up only when something needs you.",
    },
    {
      id: "approval",
      icon: ShieldCheckIcon,
      title: "Ideas to trades, on your terms",
      description:
        "See the reasoning, the risk and the tax cost first. You decide how much Rocca handles, and by default nothing runs without your OK.",
    },
    {
      id: "learn",
      icon: GraduationCapIcon,
      title: "Learn as you go",
      description:
        "New to investing? Rocca teaches with short lessons picked from what you own, so every move makes sense to you.",
    },
  ] satisfies Feature[],
} as const

/**
 * Simulated data for the small product vignettes on the
 * feature cards. Decorative only and consistent with `preview` (the account
 * values add up to `preview.portfolio.value`).
 */
export const illustrations = {
  /**
   * `institution` and `access` show which brokers let Rocca place trades
   * ("trade") and which only share data ("view"). The NVDA trade runs in the
   * Roth IRA, so that account must stay "trade" (a test checks it).
   */
  accounts: [
    {
      name: "Brokerage",
      institution: "Fidelity",
      access: "view",
      value: "$142,880",
      share: 57.5,
    },
    {
      name: "Roth IRA",
      institution: "E*TRADE",
      access: "trade",
      value: "$48,211",
      share: 19.4,
    },
    {
      name: "401(k)",
      institution: "Empower",
      access: "view",
      value: "$39,512",
      share: 15.9,
    },
    {
      name: "Crypto",
      institution: "Coinbase",
      access: "trade",
      value: "$17,707",
      share: 7.1,
    },
  ],
  moves: {
    title: "What moved this week",
    /** `share` is relative to the largest mover, for the bar length. */
    items: [
      { symbol: "NVDA", amount: "+$3,120", share: 100 },
      { symbol: "VTI", amount: "+$1,040", share: 33 },
      { symbol: "Other", amount: "+$230", share: 7 },
    ],
  },
  approval: {
    title: "Trim NVDA to 12%",
    status: "Needs your OK",
    detail: "Sell 84 NVDA · Buy 50 VTI",
  },
  /** Also feeds the dashboard preview's Learn widget, so both show the same lesson. */
  learn: {
    progress: { done: 3, total: 12 },
    next: {
      meta: "Next lesson · 3 min",
      title: "Why one stock shouldn't run your portfolio",
      reason: "Picked for you: NVDA is 18% of your holdings.",
    },
  },
} as const

export const howItWorks = {
  eyebrow: "How it works",
  title: "From waitlist to your first brief.",
  steps: [
    {
      title: "Join the waitlist",
      description:
        "Explore a preview of your dashboard right away. Full access arrives by email, in small batches.",
    },
    {
      title: "Connect your accounts",
      description:
        "Link the accounts you already have in a couple of minutes. Rocca never sees your password.",
    },
    {
      title: "Meet your agent",
      description:
        "Get your first portfolio brief the next morning and start asking questions.",
    },
  ],
} as const

export const faq = {
  eyebrow: "FAQ",
  title: "Questions, answered.",
  items: [
    {
      question: "What is Rocca?",
      answer:
        "Rocca is an AI investing agent. It connects to the accounts you already have, explains what's happening with your money, and helps you act on ideas, on your terms.",
    },
    {
      question: "How is Rocca different from my broker's AI assistant?",
      answer:
        "Your broker's assistant only sees the money held there. Rocca looks across all your accounts, so it catches what no single broker can: the same stock hiding inside three funds, or a sale that costs $0 in tax in one account and $765 in another. And it works for you, not for a broker.",
    },
    {
      question: "Is Rocca for beginners?",
      answer:
        "Yes. You can start in Explain only mode: Rocca watches and teaches, and you make every move. Lessons are picked from what you actually own, so they always apply to you.",
    },
    {
      question: "Which brokers work with Rocca?",
      answer:
        "You can connect most major US brokerages, retirement plans and crypto exchanges to see everything in one place. Rocca places the trades you approve wherever your broker allows it, such as E*TRADE, Webull, Public and Coinbase. At brokers that don't, like Fidelity or Vanguard, Rocca prepares the order and you place it in your broker's app.",
    },
    {
      question: "Will Rocca trade without asking me?",
      answer:
        "Not unless you allow it. By default, Rocca suggests trades and waits for your OK. Autopilot, where Rocca acts within the rules you set and tells you right after, comes after launch and only at brokers that allow it.",
    },
    {
      question: "Does Rocca hold my money?",
      answer:
        "No. Your money stays at your brokerage or bank. Rocca connects to the accounts you already have.",
    },
    {
      question: "How will my data be protected?",
      answer:
        "Rocca connects to your accounts through established brokerage-data providers. We never see or store your broker password. Rocca can only place the trades you allow, and it can never withdraw or transfer money out of your accounts. We'll publish our full security practices before launch.",
    },
    {
      question: "Is Rocca a registered investment adviser?",
      answer:
        "Not yet. Before Rocca gives personalized advice to anyone, it will register as an investment adviser with the SEC and follow the same rules as traditional advisers.",
    },
    {
      question: "When will I get access?",
      answer:
        "Right after you join, you can explore a preview of the dashboard with simulated data. Full access opens in batches, and you'll get an email when your spot is ready.",
    },
    {
      question: "How much will it cost?",
      answer:
        "Joining the waitlist is free. We'll share pricing before launch, and people on the waitlist will hear first.",
    },
  ],
} as const

export const finalCta = {
  title: "Be first in line.",
  description: "Join the waitlist and get early access when invites open.",
} as const

export const footer = {
  tagline: "Your AI investing agent.",
  disclaimer:
    "Rocca is in development and not yet available. Nothing on this website is investment advice. Rocca is not a registered investment adviser. Investing involves risk, including possible loss of principal. Product previews are simulated. Company and brokerage names in the product preview are for illustration only; Rocca is not affiliated with or endorsed by them.",
} as const
