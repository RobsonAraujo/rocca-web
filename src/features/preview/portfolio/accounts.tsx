import { LandmarkIcon } from "lucide-react"

import { illustrations } from "@/features/landing/content"

import { Panel } from "../components/panel"
import { formatPercent, formatUsd } from "../format"
import { accountTotal, accountsCopy, holdings, portfolioTotal } from "./data"

/** One tile per account, with its tax treatment (the tax-smart angle). */
export function AccountsWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="accounts"
      title={accountsCopy.title}
      description={accountsCopy.description}
      icon={LandmarkIcon}
      className={className}
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {illustrations.accounts.map(({ name }) => {
          const total = accountTotal(name)
          const details = accountsCopy.details[name]
          const count = holdings.filter((h) => h.positions[name]).length
          return (
            <li key={name} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{name}</p>
                <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-muted-foreground">
                  {details.tax}
                </span>
              </div>
              <p className="mt-3 text-xl font-semibold tracking-tight tabular-nums">
                {formatUsd(total)}
              </p>
              <p className="mt-1 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                <span className="font-medium text-brand">
                  {formatPercent(details.ytd, { signed: true })}{" "}
                  {accountsCopy.ytd}
                </span>
                <span>
                  {formatPercent(total / portfolioTotal)} · {count}{" "}
                  {count === 1 ? accountsCopy.holding : accountsCopy.holdings}
                </span>
              </p>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
