"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

import { LineChart } from "../components/line-chart"
import { portfolio } from "../data"
import { formatPercent } from "../format"

export type Range = (typeof portfolio.chart.ranges)[number]

/** Change over a series, first close to last: "+3.4%". */
export function seriesChange(values: readonly number[]) {
  const first = values[0] ?? 0
  const last = values.at(-1) ?? 0
  return formatPercent(first ? last / first - 1 : 0, { signed: true })
}

function useRange() {
  const [range, setRange] = useState<Range>(portfolio.chart.defaultRange)
  const { caption, values } = portfolio.chart.series[range]
  const change = seriesChange(values)
  const label = `Portfolio value, ${caption.toLowerCase()}: ${change}.`
  return { range, setRange, caption, values, change, label }
}

function RangeTabs({
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

/** Desktop portfolio card: caption and range tabs above the chart. */
export function PanelChart() {
  const { range, setRange, caption, values, change, label } = useRange()
  return (
    <>
      {/* Range tabs sit with the chart they control (not in the header, where they'd squeeze the title on phones). */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {caption} <span className="font-medium text-brand">{change}</span>
        </p>
        <RangeTabs range={range} onChange={setRange} />
      </div>
      <LineChart values={values} label={label} className="mt-3 h-40 sm:h-48" />
    </>
  )
}

/** Phone balance hero: edge-to-edge chart, tabs and caption below it. */
export function HeroChart({ note }: { note: string }) {
  const { range, setRange, caption, values, change, label } = useRange()
  return (
    <>
      {/* Edge to edge; the line stops short of the right edge so the end dot fits. */}
      <div className="-mx-4 mt-5 overflow-hidden">
        <LineChart values={values} label={label} className="mr-3 h-28" />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <RangeTabs range={range} onChange={setRange} />
        <span className="text-xs font-medium text-brand" aria-live="polite">
          {caption} {change}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">{note}</p>
    </>
  )
}
