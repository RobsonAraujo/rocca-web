import { cn } from "@/lib/utils"

import { suggestion } from "../data"
import { formatPercent, formatUsd } from "../format"
import { nvdaDirectValue, nvdaFundsValue, nvdaShare } from "./math"

const { scale, limit, limitLabel } = suggestion.effect
const width = (fraction: number) => `${(fraction / scale) * 100}%`

/**
 * NVDA's real weight in your money: what you own directly plus what your
 * funds hold, against your 12% limit. Same scale as the decision card's
 * trim bar, so the two read alike. Used by the lesson and the demo's first
 * look.
 */
export function NvdaExposureBar({
  labels,
  className,
}: {
  labels: { direct: string; viaFunds: string }
  className?: string
}) {
  const rows = [
    {
      label: labels.direct,
      share: nvdaShare.direct,
      value: nvdaDirectValue,
      swatch: "bg-brand",
    },
    {
      label: labels.viaFunds,
      share: nvdaShare.viaFunds,
      value: nvdaFundsValue,
      swatch: "bg-brand/35",
    },
  ]
  return (
    <div className={className}>
      <div
        role="img"
        aria-label={`NVDA: ${formatPercent(nvdaShare.direct)} directly and ${formatPercent(nvdaShare.viaFunds)} through funds, ${formatPercent(nvdaShare.total)} in all. ${limitLabel}: ${formatPercent(limit, { digits: 0 })}.`}
        className="relative h-3 rounded-full bg-secondary"
      >
        <span
          className="absolute inset-y-0 left-0 rounded-l-full bg-brand"
          style={{ width: width(nvdaShare.direct) }}
        />
        <span
          className="absolute inset-y-0 rounded-r-full bg-brand/35"
          style={{
            left: width(nvdaShare.direct),
            width: width(nvdaShare.viaFunds),
          }}
        />
        <span
          aria-hidden
          className="absolute -top-1 h-5 w-0.5 -translate-x-1/2 rounded-full bg-foreground/60"
          style={{ left: width(limit) }}
        />
      </div>
      <div className="relative mt-1.5 h-4 text-[11px] text-muted-foreground">
        <span
          className="absolute -translate-x-1/2 whitespace-nowrap"
          style={{ left: width(limit) }}
        >
          {limitLabel} {formatPercent(limit, { digits: 0 })}
        </span>
      </div>
      <dl className="mt-3 space-y-1.5 text-[13px]">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className={cn("size-2.5 shrink-0 rounded-sm", row.swatch)}
            />
            <dt className="flex-1 text-muted-foreground">{row.label}</dt>
            <dd className="font-medium tabular-nums">
              {formatPercent(row.share)}{" "}
              <span className="font-normal text-muted-foreground">
                · {formatUsd(row.value)}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
