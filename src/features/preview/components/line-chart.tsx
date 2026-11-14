import { cn } from "@/lib/utils"

const WIDTH = 600
const HEIGHT = 180
/** Vertical breathing room so the line never touches the top or bottom. */
const PADDING = 12

type LineChartProps = {
  values: readonly number[]
  /** Accessible summary, e.g. "Portfolio value over the past month, up 3.4%". */
  label: string
  className?: string
}

/**
 * Minimal area chart in plain SVG (no chart library). The SVG stretches to
 * its box; the end-point dot is HTML so it stays round at any aspect ratio.
 */
export function LineChart({ values, label, className }: LineChartProps) {
  const min = Math.min(...values)
  const span = Math.max(...values) - min || 1
  const points = values.map((value, index) => ({
    x: (index / Math.max(values.length - 1, 1)) * WIDTH,
    y: PADDING + (1 - (value - min) / span) * (HEIGHT - PADDING * 2),
  }))
  const line = points.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`)
  const last = points.at(-1)

  return (
    <div role="img" aria-label={label} className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="size-full text-brand"
        aria-hidden
      >
        {[0.25, 0.5, 0.75].map((fraction) => (
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
          points={`0,${HEIGHT} ${line.join(" ")} ${WIDTH},${HEIGHT}`}
          fill="currentColor"
          fillOpacity={0.08}
        />
        <polyline
          points={line.join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {last && (
        <span
          aria-hidden
          className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand ring-4 ring-brand/20"
          style={{
            left: `${(last.x / WIDTH) * 100}%`,
            top: `${(last.y / HEIGHT) * 100}%`,
          }}
        />
      )}
    </div>
  )
}
