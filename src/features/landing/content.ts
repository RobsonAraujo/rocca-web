import type { LucideIcon } from "lucide-react"
import {
  BellRingIcon,
  ChartLineIcon,
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
  eyebrow: "Private beta · Join the waitlist",
  title: "Invest with an agent that never sleeps.",
  /** Part of `title` the hero highlights in the brand color. */
  emphasis: "never sleeps.",
  description:
    "Rocca connects every account you own, tells you what moved your money and why, and turns your ideas into trades, only when you approve.",
  note: "No spam. We'll only email you about your invite.",
} as const

/** Short promises, restating what the FAQ answers in detail. */
export const principles = [
  { icon: ShieldCheckIcon, label: "Nothing executes without your approval" },
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
      { side: "Sell", detail: "14 NVDA", amount: "$2,486" },
      { side: "Buy", detail: "8 VTI", amount: "$2,471" },
    ],
    approve: "Approve",
    dismiss: "Not now",
  },
} as const

/** Stable key per feature, so a layout can attach visuals without relying on order. */
export type FeatureId = "accounts" | "moves" | "approval" | "alerts"

export type Feature = {
  id: FeatureId
  icon: LucideIcon
  title: string
  description: string
}

export const features = {
  eyebrow: "What Rocca does",
  title: "One agent for every account you own.",
  items: [
    {
      id: "accounts",
      icon: LayersIcon,
      title: "Every account, one view",
      description:
        "Link your brokerage, retirement and crypto accounts once. Rocca keeps a live picture of everything you own.",
    },
    {
      id: "moves",
      icon: ChartLineIcon,
      title: "Know why it moved",
      description:
        "A plain-English brief every morning on what changed in your portfolio and what is driving it.",
    },
    {
      id: "approval",
      icon: ShieldCheckIcon,
      title: "Ideas to trades, on your terms",
      description:
        "Ask for an idea and see the reasoning and the risk. Nothing is executed until you approve it.",
    },
    {
      id: "alerts",
      icon: BellRingIcon,
      title: "Alerts that matter",
      description:
        "Rocca watches the market around your holdings and reaches out only when something deserves your attention.",
    },
  ] satisfies Feature[],
} as const

/**
 * Simulated data for the small product vignettes on the
 * feature cards. Decorative only and consistent with `preview` (the account
 * values add up to `preview.portfolio.value`).
 */
export const illustrations = {
  accounts: [
    { name: "Brokerage", value: "$142,880", share: 57.5 },
    { name: "Roth IRA", value: "$48,211", share: 19.4 },
    { name: "401(k)", value: "$39,512", share: 15.9 },
    { name: "Crypto", value: "$17,707", share: 7.2 },
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
    detail: "Sell 14 NVDA · Buy 8 VTI",
  },
  alerts: [
    {
      title: "NVDA is now 18% of your portfolio",
      detail: "Above your 12% target. Want to rebalance?",
      time: "9:41",
    },
    {
      title: "NVDA reports earnings this week",
      detail: "Here's what could move your position.",
      time: "Mon",
    },
  ],
} as const

export const howItWorks = {
  eyebrow: "How it works",
  title: "From waitlist to your first brief.",
  steps: [
    {
      title: "Join the waitlist",
      description:
        "We're opening access in small batches. Your invite arrives by email.",
    },
    {
      title: "Connect your accounts",
      description: "Link the accounts you already have in a couple of minutes.",
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
        "Rocca is an AI investing agent. It connects to the accounts you already have, explains what's happening with your money, and helps you act on ideas, always with your approval.",
    },
    {
      question: "When will I get access?",
      answer:
        "We're inviting people from the waitlist in batches. You'll get an email as soon as your spot opens up.",
    },
    {
      question: "How much will it cost?",
      answer:
        "Joining the waitlist is free. We'll share pricing before launch, and people on the waitlist will hear first.",
    },
    {
      question: "Does Rocca hold my money?",
      answer:
        "No. Your money stays at your brokerage or bank. Rocca connects to the accounts you already have.",
    },
    {
      question: "Will Rocca trade without asking me?",
      answer:
        "No. Rocca can suggest trades, but nothing is executed until you review and approve it.",
    },
    {
      question: "How will my data be protected?",
      answer:
        "Security is a core part of how we're building Rocca. We'll publish exactly how we protect your data before launch.",
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
    "Rocca is in development and not yet available. Nothing on this website is investment advice. Rocca is not a registered investment adviser. Investing involves risk, including possible loss of principal. Product previews are simulated.",
} as const
