import { ArrowRightIcon, TrendingUpIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { PORTFOLIO_PATH } from "../constants"
import { LineChart } from "../components/line-chart"
import { Panel } from "../components/panel"
import { portfolio } from "../data"

/** One brand hue at decreasing strength, largest account first. */
const tints = ["bg-brand", "bg-brand/65", "bg-brand/40", "bg-brand/20"]

function RangeTabs() {
  const { ranges, activeRange } = portfolio.chart
  return (
    <div
      role="group"
      aria-label="Time range"
      className="flex items-center gap-0.5 rounded-lg bg-secondary p-0.5"
    >
      {ranges.map((range) =>
        range === activeRange ? (
          <span
            key={range}
            aria-current="true"
            className="rounded-md bg-card px-2.5 py-1 text-xs font-medium shadow-soft"
          >
            {range}
          </span>
        ) : (
          <ComingSoonButton
            key={range}
            variant="ghost"
            size="xs"
            className="px-2.5 text-muted-foreground"
          >
            {range}
          </ComingSoonButton>
        ),
      )}
    </div>
  )
}

export function PortfolioWidget({ className }: { className?: string }) {
  const { chart, weekChange } = portfolio
  return (
    <Panel
      id="portfolio"
      title={portfolio.title}
      description={portfolio.description}
      action={
        <Link
          href={PORTFOLIO_PATH}
          className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-brand outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {portfolio.viewAll}
          <ArrowRightIcon className="size-3.5" aria-hidden />
        </Link>
      }
      className={className}
    >
      <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
        <p className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
          {portfolio.value}
        </p>
        <p className="inline-flex items-center gap-1 pb-1 text-sm font-medium text-brand">
          <TrendingUpIcon className="size-4" aria-hidden />
          {weekChange.amount} · {weekChange.label}
        </p>
      </div>

      {/* Range tabs sit with the chart they control (not in the header, where they'd squeeze the title on phones). */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {chart.caption}{" "}
          <span className="font-medium text-brand">{chart.change}</span>
        </p>
        <RangeTabs />
      </div>
      <LineChart
        values={chart.values}
        label={`Portfolio value over the past month, up ${chart.change}.`}
        className="mt-3 h-40 sm:h-48"
      />

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {portfolio.accounts.map((account, index) => (
          <li
            key={account.name}
            className="rounded-xl border border-border/70 p-3"
          >
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={cn("size-2 shrink-0 rounded-full", tints[index])}
                aria-hidden
              />
              {account.name}
            </p>
            <p className="mt-1 font-semibold tabular-nums">{account.value}</p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {account.share}% of total
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
