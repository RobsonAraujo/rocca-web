import { CheckIcon, LinkIcon } from "lucide-react"

import type { Tone } from "@/components/product/tone"
import { toneClasses } from "@/components/product/tone"
import { illustrations } from "@/features/landing/content"
import { cn } from "@/lib/utils"

import { savings } from "../data"
import { formatPercent, formatUsd } from "../format"
import type { AccountName } from "../portfolio/data"
import { allocation, holdingValue, holdings } from "../portfolio/data"
import type { ConceptId } from "./data"
import { learnPage } from "./data"
import { nvdaFundsValue, nvdaPositions, nvdaShare } from "./math"

/**
 * The cards beside each stop on the course path: the real numbers from the
 * portfolio that each lesson was built from, wired to the stop with a
 * dashed line. They make "built from your portfolio" visible at a glance.
 */

const copy = learnPage.links
const whole = (fraction: number) => formatPercent(fraction, { digits: 0 })
const institution = (account: AccountName) =>
  illustrations.accounts.find((a) => a.name === account)!.institution
const holding = (name: string) => holdings.find((h) => h.name === name)!
const saving = (label: string) =>
  savings.items.find((item) => item.label === label)!.amount

/** A label, a value, and optionally a small note under the label. */
function Row({
  label,
  note,
  value,
  valueClass,
}: {
  label: string
  note?: string
  value: string
  valueClass?: string
}) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span className="min-w-0 truncate">
        <span className="font-medium">{label}</span>
        {note && <span className="text-muted-foreground"> · {note}</span>}
      </span>
      <span className={cn("shrink-0 tabular-nums", valueClass)}>{value}</span>
    </li>
  )
}

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2.5 border-t border-border pt-2 text-[11px] font-medium text-muted-foreground">
      {children}
    </p>
  )
}

/** NVDA in each account, plus what the index funds hold. */
function Concentration() {
  const accounts = Object.entries(nvdaPositions) as [AccountName, number][]
  return (
    <>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-secondary">
        <span
          className="h-full bg-brand"
          style={{ width: `${(nvdaShare.direct / 0.25) * 100}%` }}
        />
        <span
          className="h-full bg-brand/35"
          style={{ width: `${(nvdaShare.viaFunds / 0.25) * 100}%` }}
        />
      </div>
      <ul className="mt-2.5 space-y-1">
        {accounts.map(([account, value]) => (
          <Row
            key={account}
            label={institution(account)}
            note={account}
            value={formatUsd(value)}
          />
        ))}
        <Row
          label={copy.concentration.funds}
          value={formatUsd(nvdaFundsValue)}
        />
      </ul>
      <Footer>{copy.concentration.total(whole(nvdaShare.total))}</Footer>
    </>
  )
}

/** The asset classes furthest from their targets, with the target marked. */
function Rebalancing() {
  const rows = allocation
    .filter((row) => Math.abs(row.share - row.target) >= 0.05)
    .slice(0, 2)
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.assetClass}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-medium">{row.assetClass}</span>
            <span className="tabular-nums">
              {whole(row.share)}{" "}
              <span className="text-muted-foreground">
                · {copy.rebalancing.target(whole(row.target))}
              </span>
            </span>
          </div>
          <div className="relative mt-1.5 h-1.5 rounded-full bg-secondary">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-learn/70"
              style={{ width: `${row.share * 100}%` }}
            />
            <span
              aria-hidden
              className="absolute -top-0.5 h-2.5 w-0.5 -translate-x-1/2 rounded-full bg-foreground/60"
              style={{ left: `${row.target * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** The two 0.85% funds, where they sit and what they cost. */
function ExpenseRatio() {
  const funds = [
    { name: "Active Growth Fund", account: "401(k)" as const },
    { name: "Thematic Tech ETF", account: "Brokerage" as const },
  ]
  return (
    <>
      <ul className="space-y-1">
        {funds.map(({ name, account }) => (
          <Row
            key={name}
            label={name}
            note={institution(account)}
            value={formatUsd(holdingValue(holding(name)))}
          />
        ))}
      </ul>
      <Footer>{copy.expense.total(saving("High-fee funds"))}</Footer>
    </>
  )
}

/** Positions below what was paid for them. */
function Harvest() {
  const losers = holdings.filter((h) => (h.gain ?? 0) < 0)
  return (
    <>
      <ul className="space-y-1">
        {losers.map((h) => (
          <Row
            key={h.name}
            label={h.symbol ?? h.name}
            note={formatUsd(holdingValue(h))}
            value={formatPercent(h.gain!)}
            valueClass="font-medium text-attention"
          />
        ))}
      </ul>
      <Footer>{copy.harvest.total(saving("Tax-loss harvesting"))}</Footer>
    </>
  )
}

/** The biggest holdings inside the Roth IRA. */
function RothIra() {
  const roth = illustrations.accounts.find((a) => a.name === "Roth IRA")!
  const inside = holdings
    .filter((h) => h.positions["Roth IRA"])
    .sort(
      (a, b) => (b.positions["Roth IRA"] ?? 0) - (a.positions["Roth IRA"] ?? 0),
    )
    .slice(0, 3)
  return (
    <>
      <ul className="space-y-1">
        {inside.map((h) => (
          <Row
            key={h.name}
            label={h.symbol ?? h.name}
            value={formatUsd(h.positions["Roth IRA"] ?? 0)}
          />
        ))}
      </ul>
      <Footer>
        {roth.institution} · {copy.roth.total(roth.value)}
      </Footer>
    </>
  )
}

const cards: Record<ConceptId, { title: string; body: () => React.ReactNode }> =
  {
    concentration: { title: copy.concentration.title, body: Concentration },
    rebalancing: { title: copy.rebalancing.title, body: Rebalancing },
    "expense-ratio": { title: copy.expense.title, body: ExpenseRatio },
    "tax-loss-harvesting": { title: copy.harvest.title, body: Harvest },
    "roth-ira": { title: copy.roth.title, body: RothIra },
  }

export type LinkSide = "left" | "right"

/**
 * One card, placed beside its stop (inside the stop's relative wrapper)
 * with a dashed wire to it. Learned stops say "Understood"; the next one
 * says so too. Hidden on phones, where the stop's chip says it in short.
 */
export function PortfolioLink({
  id,
  side,
  state,
  tone,
  className,
}: {
  id: ConceptId
  side: LinkSide
  state: "learned" | "current" | "locked"
  tone: Tone
  className?: string
}) {
  const { title, body: Body } = cards[id]
  const active = state !== "locked"
  return (
    <div
      className={cn(
        "absolute top-1/2 w-68 -translate-y-1/2",
        side === "right" ? "left-full ml-10" : "right-full mr-10",
        className,
      )}
    >
      {/* The wire: from the card's edge to the stop, ending in a dot. */}
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 w-10 border-t-2 border-dashed",
          side === "right" ? "right-full" : "left-full",
          active ? toneClasses[tone].text : "text-border",
        )}
        style={{ borderColor: "currentColor" }}
      >
        <span
          className={cn(
            "absolute -top-[5px] size-2 rounded-full bg-current",
            side === "right" ? "left-0" : "right-0",
          )}
        />
      </span>

      <div
        className={cn(
          "rounded-2xl bg-card p-3.5 text-xs shadow-soft ring-1",
          state === "current"
            ? cn("ring-2", toneClasses[tone].ring)
            : state === "learned"
              ? toneClasses[tone].ring
              : "ring-border",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "flex items-center gap-1 text-[10px] font-semibold tracking-wide whitespace-nowrap uppercase",
              active ? toneClasses[tone].text : "text-muted-foreground",
            )}
          >
            <LinkIcon className="size-3" aria-hidden />
            {copy.eyebrow}
          </p>
          {state === "learned" && (
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                toneClasses[tone].tile,
              )}
            >
              <CheckIcon className="size-3" strokeWidth={3} aria-hidden />
              {copy.understood}
            </span>
          )}
          {state === "current" && (
            <span
              className={cn(
                "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                toneClasses.attention.tile,
              )}
            >
              {copy.next}
            </span>
          )}
        </div>
        <p className="mt-1 mb-2.5 text-[13px] font-semibold tracking-tight">
          {title}
        </p>
        <Body />
      </div>
    </div>
  )
}
