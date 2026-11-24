import { illustrations, preview } from "@/features/landing/content"
import type { RuleId } from "@/features/preview/data"
import { rules } from "@/features/preview/data"
import { holdings } from "@/features/preview/portfolio/data"

/**
 * All copy of the recordable demo (/demo): a simulated first visit by a
 * fictional investor, from signing in to the first look at her accounts.
 * The accounts and numbers come from the preview's simulated portfolio.
 */

/** The fictional investor the demo signs in as. */
export const persona = {
  name: "Maya",
  fullName: "Maya Chen",
  email: "maya@example.com",
  initials: "MC",
} as const

const accountCount = illustrations.accounts.length

const ruleLabel = (id: RuleId) =>
  rules.items.find((rule) => rule.id === id)!.label.toLowerCase()

export const flow = {
  badge: "Demo · simulated data",
  exit: "Exit demo",
  progress: "Demo progress",
  home: "Rocca home",
} as const

export const signIn = {
  title: "Sign in to Rocca",
  description: "Your AI investing agent, across every account.",
  google: "Continue with Google",
  or: "or",
  emailLabel: "Email",
  email: "Continue with email",
  pending: "Signing you in…",
  note: "Simulated sign-in for a fictional investor. Nothing is created or stored.",
} as const

export type ExperienceLevel = "new" | "some" | "experienced"

export const onboarding = {
  title: `Welcome, ${persona.name}.`,
  question: "How much have you invested before?",
  levels: [
    {
      id: "new",
      label: "I'm new to this",
      description: "I have accounts, but I'm not sure what's in them.",
    },
    {
      id: "some",
      label: "I know the basics",
      description: "I've picked funds or stocks myself.",
    },
    {
      id: "experienced",
      label: "I'm experienced",
      description: "Skip the basics. Show me the numbers.",
    },
  ] satisfies { id: ExperienceLevel; label: string; description: string }[],
  startWith: "Rocca will start with",
  explain: {
    simple:
      "Plain-English explanations, and a 2-min lesson before any big decision",
    numbers: "Straight to the numbers. Lessons stay one tap away.",
  },
  mode: "Suggest, I approve: nothing runs without your OK",
  starterRules: `Starter rules you can change anytime: ${ruleLabel("single-stock")}, ${ruleLabel("emergency-cash")}`,
  autopilot: "Autopilot unlocks rule by rule, as you learn",
  continue: "Continue",
} as const

export const connect = {
  title: "Connect your accounts",
  description:
    "Rocca links through a secure brokerage-data provider. You sign in on your broker's own page, and Rocca never sees your password.",
  yours: "Your accounts",
  summary: (count: number, total: string) =>
    `${count} ${count === 1 ? "account" : "accounts"} · ${total}`,
  /** Clicking a broker Maya doesn't use. */
  notHers: `In this demo, ${persona.name}'s accounts are at ${illustrations.accounts.map((a) => a.institution).join(", ")}.`,
  connectRest: (count: number) => `Connect the other ${count}`,
  connecting: "Connecting…",
  connected: "Connected",
  continue: "Read my accounts",
  needAll: `Connect all ${accountCount} to see the full picture.`,
  secure: {
    title: (broker: string) => `Connect ${broker}`,
    points: [
      (broker: string) => `You sign in on ${broker}'s own page.`,
      () => "Rocca never sees or stores your password.",
      () => "Rocca can never withdraw or move money out.",
    ],
    access: {
      trade: "View and trade: Rocca can place the trades you approve.",
      view: "View only: Rocca reads balances and holdings. You place trades yourself.",
    },
    open: (broker: string) => `Continue to ${broker} (simulated)`,
    opening: (broker: string) => `Opening ${broker}…`,
    choose: "Choose what to share",
    share: "Share 1 account",
    cancel: "Cancel",
  },
  reading: {
    title: "Reading your accounts",
    steps: [
      `Reading ${holdings.length} holdings across ${accountCount} accounts`,
      "Looking inside your funds",
      "Checking tax lots in each account",
      "Comparing fees",
    ],
  },
} as const

export const firstLook = {
  eyebrow: `First look · ${accountCount} accounts · ${preview.portfolio.value}`,
  title: `${persona.name}, here's what no single broker can show you.`,
  nvda: {
    label: "Hidden in plain sight",
    title: (share: string) => `${share} of your money rides on NVIDIA`,
    body: (direct: string, viaFunds: string, limit: string) =>
      `${direct} you own directly, split between two brokers, plus ${viaFunds} inside your index funds. Your rule says ${limit}.`,
    direct: "Directly",
    viaFunds: "Inside your funds",
  },
  savings: {
    label: "Money leaking out",
    title: (total: string) => `${total} a year you could keep`,
  },
  tax: {
    label: "Where you sell matters",
    title: (brokerage: string) => `$0 vs ${brokerage} in tax for the same sale`,
    body: (brokerage: string) =>
      `Trimming NVDA inside your Roth IRA owes no tax. The same sale in your brokerage would cost about ${brokerage.replace("~", "")}.`,
    roth: "Roth IRA",
    brokerage: "Brokerage",
  },
  decision: "One decision is waiting for your OK. Rocca explains it first.",
  cta: "See your dashboard",
} as const
