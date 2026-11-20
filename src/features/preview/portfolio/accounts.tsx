import { LandmarkIcon, PlusIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { illustrations } from "@/features/landing/content"
import { cn } from "@/lib/utils"

import { Delta } from "../components/delta"
import { Panel } from "../components/panel"
import { accountAccess } from "../data"
import { formatPercent, formatUsd } from "../format"
import { ConnectTrigger } from "./connect-sheet"
import {
  accountTotal,
  accountsCopy,
  holdings,
  page,
  portfolioTotal,
} from "./data"

/** "E*TRADE" -> "E", "Coinbase" -> "C": the broker's mark in the row. */
function initial(institution: string) {
  return institution.replace(/[^A-Za-z]/g, "").charAt(0)
}

/**
 * One row per account: its broker, what Rocca can do there (trade or only
 * view), its tax treatment (the tax-smart angle), value and return.
 */
export function AccountsWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="accounts"
      title={accountsCopy.title}
      description={accountsCopy.description}
      icon={LandmarkIcon}
      className={className}
    >
      {/* One column on phones; two from sm, each row topped by a hairline but the first two. */}
      <ul className="-my-3 divide-y divide-border sm:grid sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0">
        {illustrations.accounts.map(({ name, institution, access }) => {
          const total = accountTotal(name)
          const details = accountsCopy.details[name]
          const count = holdings.filter((h) => h.positions[name]).length
          return (
            <li
              key={name}
              className="flex items-start gap-3 py-3 sm:border-t sm:border-border sm:[&:nth-child(-n+2)]:border-t-0"
            >
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-semibold"
              >
                {initial(institution)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{name}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                  <span>{institution}</span>
                  <span aria-hidden>·</span>
                  <span
                    className={cn(
                      access === "trade" && "font-medium text-brand",
                    )}
                  >
                    {accountAccess[access]}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {details.tax} · {count}{" "}
                  {count === 1 ? accountsCopy.holding : accountsCopy.holdings}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold tabular-nums">
                  {formatUsd(total)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                  {formatPercent(total / portfolioTotal)}
                </p>
                <p className="mt-0.5 text-xs">
                  <Delta
                    value={formatPercent(details.ytd, { signed: true })}
                    className="text-xs"
                  />{" "}
                  <span className="text-muted-foreground">
                    {accountsCopy.ytd}
                  </span>
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Phones: the page header (with its Connect button) is hidden. */}
      <ConnectTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "mt-6 h-10 w-full rounded-lg md:hidden",
        )}
      >
        <PlusIcon aria-hidden />
        {page.connect}
      </ConnectTrigger>
    </Panel>
  )
}
