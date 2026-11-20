"use client"

import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { cn } from "@/lib/utils"

import { Delta } from "../components/delta"
import { LineChart } from "../components/line-chart"
import { panelClass, panelLinkClass, panelSection } from "../components/panel"
import { PORTFOLIO_PATH } from "../constants"
import { accountAccess, portfolio } from "../data"
import { formatPercent, formatSignedUsd, formatUsd } from "../format"
import { RangeTabs, pointAge, seriesChange, useRange } from "./chart-ranges"

/** One brand hue at decreasing strength, largest account first. */
const tints = ["bg-brand", "bg-brand/65", "bg-brand/40", "bg-brand/20"]

const { benchmark: benchmarkCopy } = portfolio.chart

/** Where the money sits: one stacked bar, then each account below it. */
function ByAccount() {
  const { accounts } = portfolio
  return (
    <div className={panelSection}>
      <p className="text-xs font-medium text-muted-foreground">
        {portfolio.byAccount}
      </p>
      <div
        role="img"
        aria-label={accounts.map((a) => `${a.name} ${a.share}%`).join(", ")}
        className="mt-2.5 flex h-2 gap-0.5 overflow-hidden rounded-full"
      >
        {accounts.map((account, index) => (
          <span
            key={account.name}
            className={cn("h-full", tints[index])}
            style={{ width: `${account.share}%` }}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        {accounts.map((account, index) => (
          <li key={account.name} className="min-w-0">
            <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <span
                className={cn("size-2 shrink-0 rounded-full", tints[index])}
                aria-hidden
              />
              <span className="truncate">{account.name}</span>
              <span className="ml-auto tabular-nums">{account.share}%</span>
            </p>
            <p className="mt-1 font-semibold tabular-nums">{account.value}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {account.institution} · {accountAccess[account.access]}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** "— Your portfolio  ┄ S&P 500 (simulated)" */
function Legend({ compare }: { compare: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="h-0.5 w-3.5 rounded-full bg-brand" />
        Your portfolio
      </span>
      {compare && (
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="w-3.5 border-t-[1.5px] border-dashed border-muted-foreground/70"
          />
          {benchmarkCopy.name} ({benchmarkCopy.note})
        </span>
      )}
    </div>
  )
}

/**
 * The top of the overview, the way investing apps open: the total, how it
 * moved over the chosen range, and the chart. Scrubbing the chart shows the
 * value at that point in the big number (Robinhood-style), and the S&P 500
 * can be overlaid for context ("never show a change without a benchmark").
 */
export function PortfolioHero({ className }: { className?: string }) {
  const { range, setRange, series, change, label } = useRange()
  const [active, setActive] = useState<number | null>(null)
  const [compare, setCompare] = useState(false)

  const { values, benchmark, step, caption, since } = series
  const lastIndex = values.length - 1
  const index = active ?? lastIndex
  const start = values[0]!
  const current = values[index]!
  const value = active === null ? portfolio.value : formatUsd(current)
  const amount = formatSignedUsd(current - start)
  const percent = formatPercent(current / start - 1, { signed: true })
  const when = active === null ? caption : pointAge(step, lastIndex - active)
  const benchmarkChange = formatPercent(benchmark[index]! / benchmark[0]! - 1, {
    signed: true,
  })
  const chartLabel = compare
    ? `${label} ${benchmarkCopy.name}: ${seriesChange(benchmark)}.`
    : label

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-title"
      className={cn(panelClass, "flex scroll-mt-24 flex-col p-5", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            id="portfolio-title"
            className="text-[13px] font-medium text-muted-foreground"
          >
            {portfolio.title}
          </h2>
          <p className="mt-1.5 text-[2.5rem] leading-none font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <Delta value={amount}>
              {/* The percent keeps its own node: "(+3.4%)" reads as one figure. */}
              <span>
                (<span>{percent}</span>)
              </span>
            </Delta>
            <span className="text-muted-foreground">{when}</span>
            {compare && (
              <span className="text-muted-foreground tabular-nums">
                · {benchmarkCopy.name} {benchmarkChange}
              </span>
            )}
          </p>
          {/* Announce range changes only, not every scrub step. */}
          <p className="sr-only" aria-live="polite">
            {caption}: {change}
          </p>
        </div>
        <Link href={PORTFOLIO_PATH} className={panelLinkClass}>
          {portfolio.viewAll}
          <ArrowRightIcon className="size-3.5" aria-hidden />
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Legend compare={compare} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={compare}
            onClick={() => setCompare((on) => !on)}
            className={cn(
              "h-7 rounded-lg border px-2.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              compare
                ? "border-foreground/20 bg-secondary text-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {benchmarkCopy.toggle}
          </button>
          <RangeTabs
            range={range}
            onChange={(next) => {
              setActive(null)
              setRange(next)
            }}
          />
        </div>
      </div>

      <LineChart
        values={values}
        benchmark={compare ? benchmark : undefined}
        label={chartLabel}
        axis={{ start: since, end: portfolio.chart.today }}
        onScrub={setActive}
        className="mt-4 h-64"
      />

      <ByAccount />
    </section>
  )
}
