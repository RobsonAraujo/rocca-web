import { preview } from "@/features/landing/content"

import { Stat } from "../components/stat"
import { formatPercent, formatSignedUsd, formatUsd } from "../format"
import {
  holdingValue,
  holdings,
  kpis,
  portfolioTotal,
  totalGain,
  totalGainPercent,
} from "./data"

/**
 * Four headline numbers across the top of the Portfolio page, in one
 * surface split by hairlines (the gap-px over a border-colored background).
 */
export function KpiStrip() {
  const cash = holdings
    .filter((h) => h.kind === "Cash")
    .reduce((sum, h) => sum + holdingValue(h), 0)

  const items = [
    {
      label: kpis.value.label,
      value: preview.portfolio.value,
      delta: kpis.value.delta,
      hint: kpis.value.hint,
    },
    {
      label: kpis.gain.label,
      value: formatSignedUsd(totalGain),
      delta: formatPercent(totalGainPercent, { signed: true }),
      hint: kpis.gain.hint,
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
    // Phones: the big total sits in the mobile hero, so its cell hides and
    // the other three share one row.
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border max-md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <Stat
          key={item.label}
          {...item}
          className="bg-card p-5 max-md:p-3 max-md:first:hidden"
        />
      ))}
    </dl>
  )
}
