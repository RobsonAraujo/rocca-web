import { ArrowRightIcon, TrendingUpIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { PORTFOLIO_PATH } from "../constants"
import { Panel } from "../components/panel"
import { portfolio } from "../data"
import { PanelChart } from "./chart-ranges"

/** One brand hue at decreasing strength, largest account first. */
const tints = ["bg-brand", "bg-brand/65", "bg-brand/40", "bg-brand/20"]

export function PortfolioWidget({ className }: { className?: string }) {
  const { weekChange } = portfolio
  return (
    <Panel
      id="portfolio"
      title={portfolio.title}
      description={portfolio.description}
      action={
        <Link
          href={PORTFOLIO_PATH}
          className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-brand outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {portfolio.viewAll}
          <ArrowRightIcon className="size-3.5" aria-hidden />
        </Link>
      }
      className={className}
    >
      <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
        <p className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
          {portfolio.value}
        </p>
        <p className="inline-flex items-center gap-1 pb-1 text-sm font-medium text-brand">
          <TrendingUpIcon className="size-4" aria-hidden />
          {weekChange.amount} · {weekChange.label}
        </p>
      </div>

      <PanelChart />

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {portfolio.accounts.map((account, index) => (
          <li
            key={account.name}
            className="rounded-xl border border-border/70 p-3"
          >
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={cn("size-2 shrink-0 rounded-full", tints[index])}
                aria-hidden
              />
              {account.name}
            </p>
            <p className="mt-1 font-semibold tabular-nums">{account.value}</p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {account.share}% of total
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
