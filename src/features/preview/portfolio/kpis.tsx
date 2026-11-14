import { preview } from "@/features/landing/content"
import { cn } from "@/lib/utils"

import { panelClass } from "../components/panel"
import { formatPercent, formatSignedUsd, formatUsd } from "../format"
import {
  holdingValue,
  holdings,
  kpis,
  portfolioTotal,
  totalGain,
  totalGainPercent,
} from "./data"

/** Four headline numbers across the top of the Portfolio page. */
export function KpiStrip() {
  const cash = holdings
    .filter((h) => h.kind === "Cash")
    .reduce((sum, h) => sum + holdingValue(h), 0)

  const items = [
    {
      label: kpis.value.label,
      value: preview.portfolio.value,
      hint: kpis.value.hint,
      positive: true,
    },
    {
      label: kpis.gain.label,
      value: formatSignedUsd(totalGain),
      hint: `${formatPercent(totalGainPercent, { signed: true })} ${kpis.gain.hint}`,
      positive: true,
    },
    {
      label: kpis.dividends.label,
      value: formatUsd(kpis.dividends.value),
      hint: kpis.dividends.hint,
    },
    {
      label: kpis.cash.label,
      value: formatUsd(cash),
      hint: `${formatPercent(cash / portfolioTotal)} ${kpis.cash.hint}`,
    },
  ]

  return (
    // Phones: the big total sits in the mobile hero, so its card hides and
    // the other three share one row.
    <dl className="grid grid-cols-2 gap-4 max-md:grid-cols-3 max-md:gap-2 lg:grid-cols-4 lg:gap-6">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "border border-border bg-card p-4 max-md:p-3 max-md:first:hidden sm:p-5",
            panelClass,
          )}
        >
          <dt className="text-xs text-muted-foreground sm:text-sm">
            {item.label}
          </dt>
          <dd className="mt-1 text-xl font-semibold tracking-tight tabular-nums max-md:text-base sm:text-2xl">
            {item.value}
          </dd>
          <dd
            className={cn(
              "mt-1 text-xs",
              item.positive
                ? "font-medium text-brand"
                : "text-muted-foreground",
            )}
          >
            {item.hint}
          </dd>
        </div>
      ))}
    </dl>
  )
}
