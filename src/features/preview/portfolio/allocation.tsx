import { ChartPieIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Panel } from "../components/panel"
import { formatPercent } from "../format"
import type { AssetClass } from "./data"
import { allocation, allocationCopy } from "./data"

/**
 * One hue (brand) at decreasing strength, plus a neutral for cash: the chart
 * reads clearly without adding colors to the palette.
 */
const classStyle: Record<
  AssetClass,
  { dot: string; stroke: string; opacity: number }
> = {
  "US stocks": { dot: "bg-brand", stroke: "text-brand", opacity: 1 },
  International: { dot: "bg-brand/65", stroke: "text-brand", opacity: 0.65 },
  Bonds: { dot: "bg-brand/40", stroke: "text-brand", opacity: 0.4 },
  Crypto: { dot: "bg-brand/20", stroke: "text-brand", opacity: 0.2 },
  Cash: {
    dot: "bg-muted-foreground/35",
    stroke: "text-muted-foreground",
    opacity: 0.35,
  },
}

/** Circumference of r=15.915 is 100, so dash lengths are plain percentages. */
const RADIUS = 15.915
/** Small gap between segments, in percent of the ring. */
const GAP = 0.8

/** Each slice starts where the previous ones end (computed once, outside render). */
const segments = allocation.map(({ assetClass, share }, index) => ({
  assetClass,
  length: share * 100,
  start: allocation
    .slice(0, index)
    .reduce((sum, previous) => sum + previous.share * 100, 0),
}))

function Donut() {
  return (
    <svg
      viewBox="0 0 42 42"
      className="size-36 shrink-0 -rotate-90"
      aria-hidden
    >
      {segments.map(({ assetClass, length, start }) => (
        <circle
          key={assetClass}
          cx="21"
          cy="21"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          stroke="currentColor"
          strokeOpacity={classStyle[assetClass].opacity}
          className={classStyle[assetClass].stroke}
          strokeDasharray={`${Math.max(length - GAP, 0)} ${100 - length + GAP}`}
          strokeDashoffset={-start}
        />
      ))}
    </svg>
  )
}

function TargetStatus({ share, target }: { share: number; target: number }) {
  const gap = share - target
  if (Math.abs(gap) < allocationCopy.tolerance) {
    return (
      <span className="text-xs font-medium text-brand">
        {allocationCopy.onTarget}
      </span>
    )
  }
  return (
    <span className="rounded-full bg-attention/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-attention">
      {/* Percentage points, not a relative %: "70.5% vs 60%" is 10 pts over. */}
      {Math.round(Math.abs(gap) * 100)} {allocationCopy.points}{" "}
      {gap > 0 ? allocationCopy.over : allocationCopy.under}
    </span>
  )
}

export function AllocationWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="allocation"
      title={allocationCopy.title}
      description={allocationCopy.description}
      icon={ChartPieIcon}
      className={className}
    >
      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
        <div
          role="img"
          aria-label={allocation
            .map((a) => `${a.assetClass} ${formatPercent(a.share)}`)
            .join(", ")}
          className="mx-auto"
        >
          <Donut />
        </div>

        <ul className="divide-y divide-border">
          {allocation.map(({ assetClass, share, target }) => (
            <li key={assetClass} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      classStyle[assetClass].dot,
                    )}
                    aria-hidden
                  />
                  {assetClass}
                </span>
                <span className="flex items-center gap-2">
                  <TargetStatus share={share} target={target} />
                  <span className="w-12 text-right font-semibold tabular-nums">
                    {formatPercent(share)}
                  </span>
                </span>
              </div>
              {/* Bar = what you hold; the dark tick = your target. */}
              <div className="relative mt-2 h-1.5 rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full",
                    classStyle[assetClass].dot,
                  )}
                  style={{ width: `${share * 100}%` }}
                />
                <span
                  className="absolute -top-1 h-3.5 w-0.5 -translate-x-1/2 rounded-full bg-foreground/70"
                  style={{ left: `${target * 100}%` }}
                  aria-hidden
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {allocationCopy.target} {formatPercent(target, { digits: 0 })}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}
