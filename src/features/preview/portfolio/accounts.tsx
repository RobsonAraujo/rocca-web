import { LandmarkIcon, PlusIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { illustrations } from "@/features/landing/content"
import { cn } from "@/lib/utils"

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

const badgeClass =
  "rounded-md px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap"

/**
 * One tile per account: its broker, what Rocca can do there (trade or only
 * view) and its tax treatment (the tax-smart angle).
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
      <ul className="grid gap-3 sm:grid-cols-2">
        {illustrations.accounts.map(({ name, institution, access }) => {
          const total = accountTotal(name)
          const details = accountsCopy.details[name]
          const count = holdings.filter((h) => h.positions[name]).length
          return (
            <li key={name} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">{institution}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={cn(
                      badgeClass,
                      access === "trade"
                        ? "bg-brand/10 text-brand"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {accountAccess[access]}
                  </span>
                  <span
                    className={cn(
                      badgeClass,
                      "bg-secondary text-muted-foreground",
                    )}
                  >
                    {details.tax}
                  </span>
                </div>
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

      {/* Phones: the page header (with its Connect button) is hidden. */}
      <ConnectTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "mt-4 h-10 w-full rounded-full md:hidden",
        )}
      >
        <PlusIcon aria-hidden />
        {page.connect}
      </ConnectTrigger>
    </Panel>
  )
}
