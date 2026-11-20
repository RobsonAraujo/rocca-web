"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

import { LineChart } from "../components/line-chart"
import type { ChartStep } from "../data"
import { portfolio } from "../data"
import { formatPercent } from "../format"

export type Range = (typeof portfolio.chart.ranges)[number]

/** Change over a series, first close to last: "+3.4%". */
export function seriesChange(values: readonly number[]) {
  const first = values[0] ?? 0
  const last = values.at(-1) ?? 0
  return formatPercent(first ? last / first - 1 : 0, { signed: true })
}

/**
 * When a point was, counted back from today: "Today", "Yesterday",
 * "12 days ago", "6 weeks ago", "9 months ago", "4 years ago". Relative on
 * purpose: the page is static, so absolute dates would go stale.
 */
export function pointAge(step: ChartStep, stepsBack: number) {
  const count = step.size * stepsBack
  if (count === 0) return portfolio.chart.today
  if (step.unit === "day")
    return count === 1 ? "Yesterday" : `${count} days ago`
  // Past two months, weeks read oddly ("46 weeks ago"): switch to months.
  const months = step.unit === "week" ? Math.round((count * 7) / 30.4) : count
  if (step.unit === "week" && count < 9) {
    return count === 1 ? "1 week ago" : `${count} weeks ago`
  }
  if (months < 24) return months === 1 ? "1 month ago" : `${months} months ago`
  return `${Math.round(months / 12)} years ago`
}

export function useRange() {
  const [range, setRange] = useState<Range>(portfolio.chart.defaultRange)
  const series = portfolio.chart.series[range]
  const change = seriesChange(series.values)
  const label = `Portfolio value, ${series.caption.toLowerCase()}: ${change}.`
  return { range, setRange, series, change, label }
}

/** Segmented 1W / 1M / 1Y / All switch; each option is a pressed toggle. */
export function RangeTabs({
  range,
  onChange,
  className,
}: {
  range: Range
  onChange: (range: Range) => void
  className?: string
}) {
  return (
    <div
      role="group"
      aria-label="Time range"
      className={cn(
        "flex items-center gap-0.5 rounded-lg bg-secondary p-0.5",
        className,
      )}
    >
      {portfolio.chart.ranges.map((item) => {
        const active = item === range
        return (
          <button
            key={item}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(item)}
            className={cn(
              "h-6 rounded-md px-2.5 text-xs font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}

/** Phone balance hero: edge-to-edge chart, tabs and caption below it. */
export function HeroChart({ note }: { note: string }) {
  const { range, setRange, series, change, label } = useRange()
  return (
    <>
      {/* Edge to edge; the line stops short of the right edge so the end dot fits. */}
      <div className="-mx-4 mt-5 overflow-hidden">
        <LineChart values={series.values} label={label} className="mr-3 h-28" />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <RangeTabs range={range} onChange={setRange} />
        <span className="text-xs font-medium text-brand" aria-live="polite">
          {series.caption} {change}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">{note}</p>
    </>
  )
}
