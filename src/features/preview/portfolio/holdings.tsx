import { ListIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { Delta } from "../components/delta"
import { Panel } from "../components/panel"
import { formatPercent, formatUsd } from "../format"
import type { AccountName, Holding } from "./data"
import { holdingValue, holdings, holdingsCopy, portfolioTotal } from "./data"

/** Ticker if there is one, else initials ("Active Growth Fund" -> "AG"). */
function badgeText(holding: Holding) {
  if (holding.kind === "Cash") return "$"
  if (holding.symbol) return holding.symbol
  return holding.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
}

/** A holding's return; "—" (no cost basis, e.g. cash) stays quiet. */
function Gain({ value }: { value: string }) {
  return value === "—" ? (
    <span className="text-muted-foreground">{value}</span>
  ) : (
    <Delta value={value} className="justify-end" />
  )
}

function FilterTabs() {
  const [active, ...rest] = holdingsCopy.filters
  return (
    <div
      role="group"
      aria-label="Filter holdings"
      className="flex items-center gap-0.5 rounded-lg bg-secondary p-0.5"
    >
      <span
        aria-current="true"
        className="rounded-md bg-card px-2.5 py-1 text-xs font-medium shadow-soft"
      >
        {active}
      </span>
      {rest.map((filter) => (
        <ComingSoonButton
          key={filter}
          variant="ghost"
          size="xs"
          className="hidden px-2.5 text-muted-foreground sm:inline-flex"
        >
          {filter}
        </ComingSoonButton>
      ))}
    </div>
  )
}

export function HoldingsWidget({ className }: { className?: string }) {
  const accountCount = new Set(
    holdings.flatMap((h) => Object.keys(h.positions)),
  ).size
  const { columns } = holdingsCopy
  const cell = "py-3 pr-3 last:pr-0"

  return (
    <Panel
      id="holdings"
      title={holdingsCopy.title}
      description={`${holdings.length} positions across ${accountCount} accounts.`}
      icon={ListIcon}
      action={<FilterTabs />}
      className={className}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
              <th scope="col" className={cn(cell, "font-medium")}>
                {columns.asset}
              </th>
              <th
                scope="col"
                className={cn(cell, "hidden font-medium md:table-cell")}
              >
                {columns.accounts}
              </th>
              <th scope="col" className={cn(cell, "text-right font-medium")}>
                {columns.value}
              </th>
              <th
                scope="col"
                className={cn(cell, "hidden w-44 font-medium sm:table-cell")}
              >
                {columns.weight}
              </th>
              <th
                scope="col"
                className={cn(
                  cell,
                  "hidden text-right font-medium sm:table-cell",
                )}
              >
                {columns.gain}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {holdings.map((holding) => {
              const value = holdingValue(holding)
              const weight = value / portfolioTotal
              const accounts = Object.keys(holding.positions) as AccountName[]
              const gainText =
                holding.gain === undefined
                  ? "—"
                  : formatPercent(holding.gain, { signed: true })
              return (
                <tr
                  key={holding.name}
                  className="transition-colors hover:bg-muted/40"
                >
                  <td className={cell}>
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-secondary text-[10px] font-semibold tracking-tight">
                        {badgeText(holding)}
                      </span>
                      <div className="min-w-0">
                        <p className="max-w-[7.5rem] truncate font-medium sm:max-w-none">
                          {holding.symbol ?? holding.name}
                        </p>
                        <p className="max-w-[7.5rem] truncate text-xs text-muted-foreground sm:max-w-none">
                          {holding.symbol ? holding.name : holding.kind}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={cn(cell, "hidden md:table-cell")}>
                    <div className="flex flex-wrap gap-1">
                      {accounts.map((account) => (
                        <span
                          key={account}
                          className="rounded-md border border-border px-1.5 py-0.5 text-[11px] whitespace-nowrap text-muted-foreground"
                        >
                          {account}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td
                    className={cn(
                      cell,
                      "text-right font-medium whitespace-nowrap tabular-nums",
                    )}
                  >
                    {formatUsd(value)}
                    {/* Phones: the Return column is hidden, so show it here. */}
                    <span className="block text-xs sm:hidden">
                      <Gain value={gainText} />
                    </span>
                  </td>
                  <td className={cn(cell, "hidden sm:table-cell")}>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <span
                          className="block h-full rounded-full bg-brand/70"
                          style={{ width: `${(weight / 0.25) * 100}%` }}
                        />
                      </span>
                      <span className="w-11 text-right text-xs tabular-nums">
                        {formatPercent(weight)}
                      </span>
                    </div>
                  </td>
                  <td
                    className={cn(
                      cell,
                      "hidden text-right whitespace-nowrap sm:table-cell",
                    )}
                  >
                    <Gain value={gainText} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
