"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

import { formatCompactUsd } from "../format"

const WIDTH = 600
const HEIGHT = 180
/** Vertical breathing room so the line never touches the top or bottom. */
const PADDING = 12
/** Where the dashed gridlines sit, as fractions of the height. */
const GRID = [0.25, 0.5, 0.75]

type LineChartProps = {
  values: readonly number[]
  /** A second, dashed series on the same scale (e.g. a market index). */
  benchmark?: readonly number[]
  /** Accessible summary, e.g. "Portfolio value over the past month, up 3.4%". */
  label: string
  className?: string
  /** Value labels beside the gridlines, and start/end labels below. */
  axis?: { start: string; end: string }
  /**
   * Makes the chart scrubbable: called with the point under the pointer
   * (or finger), and with null when it leaves. The caller shows the value.
   */
  onScrub?: (index: number | null) => void
}

type Point = { x: number; y: number }

/**
 * Area chart in plain SVG (no chart library). The SVG stretches to its box;
 * dots and the scrub cursor are HTML so they stay round at any aspect ratio.
 */
export function LineChart({
  values,
  benchmark,
  label,
  className,
  axis,
  onScrub,
}: LineChartProps) {
  const [active, setActive] = useState<number | null>(null)
  const all = benchmark ? [...values, ...benchmark] : values
  const min = Math.min(...all)
  const span = Math.max(...all) - min || 1
  const last = Math.max(values.length - 1, 1)
  const toPoints = (series: readonly number[]): Point[] =>
    series.map((value, index) => ({
      x: (index / last) * WIDTH,
      y: PADDING + (1 - (value - min) / span) * (HEIGHT - PADDING * 2),
    }))
  const points = toPoints(values)
  const benchmarkPoints = benchmark ? toPoints(benchmark) : null
  const line = (series: Point[]) =>
    series.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")

  /** The value a gridline at `fraction` of the height stands for. */
  const gridValue = (fraction: number) =>
    min + span * (1 - (HEIGHT * fraction - PADDING) / (HEIGHT - PADDING * 2))

  const scrub = (index: number | null) => {
    setActive(index)
    onScrub?.(index)
  }
  const indexAt = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const fraction = rect.width ? (event.clientX - rect.left) / rect.width : 1
    return Math.round(Math.min(Math.max(fraction, 0), 1) * last)
  }
  const scrubHandlers = onScrub
    ? {
        onPointerMove: (event: React.PointerEvent<HTMLElement>) =>
          scrub(indexAt(event)),
        onPointerDown: (event: React.PointerEvent<HTMLElement>) =>
          scrub(indexAt(event)),
        onPointerLeave: () => scrub(null),
      }
    : {}

  const cursor = active === null ? null : points[active]
  const benchmarkCursor =
    active === null || !benchmarkPoints ? null : benchmarkPoints[active]
  const endPoint = points.at(-1)
  const position = (point: Point) => ({
    left: `${(point.x / WIDTH) * 100}%`,
    top: `${(point.y / HEIGHT) * 100}%`,
  })

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex min-h-0 flex-1">
        <div
          role="img"
          aria-label={label}
          data-scrubbing={active !== null || undefined}
          className={cn("relative min-w-0 flex-1", onScrub && "touch-pan-y")}
          {...scrubHandlers}
        >
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            className="size-full text-brand"
            aria-hidden
          >
            {GRID.map((fraction) => (
              <line
                key={fraction}
                x1={0}
                x2={WIDTH}
                y1={HEIGHT * fraction}
                y2={HEIGHT * fraction}
                className="text-border"
                stroke="currentColor"
                strokeDasharray="3 5"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <polygon
              points={`0,${HEIGHT} ${line(points)} ${WIDTH},${HEIGHT}`}
              fill="currentColor"
              fillOpacity={0.07}
            />
            {benchmarkPoints && (
              <polyline
                points={line(benchmarkPoints)}
                fill="none"
                className="text-muted-foreground/70"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}
            <polyline
              points={line(points)}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {cursor ? (
            <>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-foreground/25"
                style={{ left: position(cursor).left }}
              />
              {benchmarkCursor && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-muted-foreground"
                  style={position(benchmarkCursor)}
                />
              )}
              <span
                aria-hidden
                className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-brand"
                style={position(cursor)}
              />
            </>
          ) : (
            endPoint && (
              <span
                aria-hidden
                className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand ring-4 ring-brand/20"
                style={position(endPoint)}
              />
            )
          )}
        </div>

        {axis && (
          <div aria-hidden className="relative w-12 shrink-0">
            {GRID.map((fraction) => (
              <span
                key={fraction}
                className="absolute right-0 -translate-y-1/2 text-[11px] text-muted-foreground tabular-nums"
                style={{ top: `${fraction * 100}%` }}
              >
                {formatCompactUsd(gridValue(fraction))}
              </span>
            ))}
          </div>
        )}
      </div>

      {axis && (
        <div
          aria-hidden
          className="mt-2 mr-12 flex justify-between text-[11px] text-muted-foreground"
        >
          <span>{axis.start}</span>
          <span>{axis.end}</span>
        </div>
      )}
    </div>
  )
}
