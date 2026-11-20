import { ChartPieIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Panel } from "../components/panel"
import { formatPercent, formatUsd } from "../format"
import type { AssetClass } from "./data"
import { allocation, allocationCopy } from "./data"

/**
 * One hue (brand) at decreasing strength, plus a neutral for cash: the bars
 * read clearly without adding colors to the palette.
 */
const classColor: Record<AssetClass, string> = {
  "US stocks": "bg-brand",
  International: "bg-brand/65",
  Bonds: "bg-brand/40",
  Crypto: "bg-brand/20",
  Cash: "bg-muted-foreground/35",
}

/** One stacked bar: every asset class side by side, widths by share. */
function MixBar({
  label,
  shares,
}: {
  label: string
  shares: { assetClass: AssetClass; share: number }[]
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-12 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <div
        role="img"
        aria-label={`${label}: ${shares
          .map((s) => `${s.assetClass} ${formatPercent(s.share)}`)
          .join(", ")}`}
        className="flex h-2.5 flex-1 gap-0.5 overflow-hidden rounded-full"
      >
        {shares.map(({ assetClass, share }) => (
          <span
            key={assetClass}
            className={cn("h-full", classColor[assetClass])}
            style={{ width: `${share * 100}%` }}
          />
        ))}
      </div>
    </div>
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
    <span className="rounded-md bg-attention/10 px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-attention">
      {/* Percentage points, not a relative %: "70.5% vs 60%" is 10 pts over. */}
      {Math.round(Math.abs(gap) * 100)} {allocationCopy.points}{" "}
      {gap > 0 ? allocationCopy.over : allocationCopy.under}
    </span>
  )
}

/**
 * Your mix against the one you set: two stacked bars (now, target) to see
 * the drift at a glance, then a table with the exact numbers and the gap.
 */
export function AllocationWidget({ className }: { className?: string }) {
  const { columns } = allocationCopy
  const cell = "py-2.5 pr-3 last:pr-0"
  return (
    <Panel
      id="allocation"
      title={allocationCopy.title}
      description={allocationCopy.description}
      icon={ChartPieIcon}
      className={className}
    >
      <div className="space-y-2.5">
        <MixBar label={allocationCopy.now} shares={allocation} />
        <MixBar
          label={allocationCopy.target}
          shares={allocation.map(({ assetClass, target }) => ({
            assetClass,
            share: target,
          }))}
        />
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
              <th scope="col" className={cn(cell, "font-medium")}>
                {columns.assetClass}
              </th>
              <th
                scope="col"
                className={cn(
                  cell,
                  "hidden text-right font-medium sm:table-cell",
                )}
              >
                {columns.value}
              </th>
              <th scope="col" className={cn(cell, "text-right font-medium")}>
                {columns.now}
              </th>
              <th scope="col" className={cn(cell, "text-right font-medium")}>
                {columns.target}
              </th>
              <th scope="col" className={cn(cell, "text-right font-medium")}>
                {columns.gap}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allocation.map(({ assetClass, value, share, target }) => (
              <tr key={assetClass}>
                <th scope="row" className={cn(cell, "text-left font-medium")}>
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2.5 shrink-0 rounded-sm",
                        classColor[assetClass],
                      )}
                      aria-hidden
                    />
                    {assetClass}
                  </span>
                </th>
                <td
                  className={cn(
                    cell,
                    "hidden text-right text-muted-foreground tabular-nums sm:table-cell",
                  )}
                >
                  {formatUsd(value)}
                </td>
                <td
                  className={cn(cell, "text-right font-semibold tabular-nums")}
                >
                  {formatPercent(share)}
                </td>
                <td
                  className={cn(
                    cell,
                    "text-right text-muted-foreground tabular-nums",
                  )}
                >
                  {formatPercent(target, { digits: 0 })}
                </td>
                <td className={cn(cell, "text-right")}>
                  <TargetStatus share={share} target={target} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
