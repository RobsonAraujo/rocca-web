import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { OrderLines } from "@/components/product/order-lines"
import { illustrations } from "@/features/landing/content"
import { cn } from "@/lib/utils"

import { Delta } from "../components/delta"
import { PORTFOLIO_PATH, PREVIEW_PATH } from "../constants"
import { accountAccess, ask, moves, suggestion } from "../data"
import { formatPercent, formatUsd } from "../format"
import { MixBar, classColor } from "../portfolio/allocation"
import {
  accountTotal,
  accountsCopy,
  allocation,
  allocationCopy,
} from "../portfolio/data"
import { DecisionBar, TrimPreview } from "../widgets/suggestion-actions"

/*
 * Dashboard components Rocca shows inside its answers (generative UI): the
 * same data and, for the trade, the same demo state as the dashboard, so
 * approving here updates the overview too.
 */

const cardClass =
  "animate-in rounded-xl border border-border bg-card p-4 text-sm duration-300 fade-in slide-in-from-bottom-1 motion-reduce:animate-none"

const linkClass =
  "inline-flex items-center gap-1 rounded-sm text-[13px] font-medium text-brand outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"

function CardTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-semibold tracking-tight">{children}</p>
}

function MoversBlock() {
  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between gap-3">
        <CardTitle>{ask.blocks.movers}</CardTitle>
        <Delta value={moves.change} className="text-xs" />
      </div>
      <ul className="mt-3 space-y-2.5">
        {moves.items.map((move) => (
          <li
            key={move.symbol}
            className="grid grid-cols-[3rem_1fr_auto] items-center gap-3"
          >
            <span className="font-medium">{move.symbol}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <span
                className="block h-full rounded-full bg-brand/70"
                style={{ width: `${move.share}%` }}
              />
            </span>
            <Delta value={move.amount} className="justify-self-end" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function AllocationBlock() {
  return (
    <div className={cardClass}>
      <CardTitle>{ask.blocks.allocation}</CardTitle>
      <div className="mt-3 space-y-2">
        <MixBar label={allocationCopy.now} shares={allocation} />
        <MixBar
          label={allocationCopy.target}
          shares={allocation.map(({ assetClass, target }) => ({
            assetClass,
            share: target,
          }))}
        />
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {allocation.map(({ assetClass, share }) => (
          <li key={assetClass} className="flex items-center gap-1.5">
            <span
              className={cn("size-2 rounded-sm", classColor[assetClass])}
              aria-hidden
            />
            {assetClass}
            <span className="font-medium text-foreground tabular-nums">
              {formatPercent(share)}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href={`${PORTFOLIO_PATH}#allocation`}
        className={cn(linkClass, "mt-3")}
      >
        {ask.blocks.allocationLink}
        <ArrowRightIcon className="size-3.5" aria-hidden />
      </Link>
    </div>
  )
}

/** The proposed trade, decided right in the chat. */
function TradeBlock() {
  const { order, taxSmart } = suggestion
  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between gap-3">
        <CardTitle>{ask.blocks.trade}</CardTitle>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-attention" aria-hidden />
          {ask.blocks.tradeStatus}
        </span>
      </div>
      <TrimPreview className="mt-3" />
      <OrderLines lines={order.lines} className="mt-1" />
      <p className="mt-1 text-[13px]">
        <span className="font-semibold text-brand">{taxSmart.estimate}</span>{" "}
        <span className="text-muted-foreground">
          in your {taxSmart.account} {taxSmart.comparison}
        </span>
      </p>
      <div className="mt-4">
        <DecisionBar />
      </div>
      <Link
        href={`${PREVIEW_PATH}#suggestion`}
        className={cn(linkClass, "mt-3")}
      >
        {ask.blocks.tradeLink}
        <ArrowRightIcon className="size-3.5" aria-hidden />
      </Link>
    </div>
  )
}

function AccountBlock() {
  const account = illustrations.accounts.find(
    (item) => item.name === suggestion.taxSmart.account,
  )!
  const details = accountsCopy.details[account.name]
  return (
    <div className={cn(cardClass, "flex items-center gap-3")}>
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-semibold"
      >
        {account.institution.replace(/[^A-Za-z]/g, "").charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <CardTitle>{ask.blocks.account}</CardTitle>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {account.institution} ·{" "}
          <span className="font-medium text-brand">
            {accountAccess[account.access]}
          </span>{" "}
          · {details.tax}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold tabular-nums">
          {formatUsd(accountTotal(account.name))}
        </p>
        <Delta
          value={formatPercent(details.ytd, { signed: true })}
          className="text-xs"
        />
      </div>
    </div>
  )
}

const components = {
  movers: MoversBlock,
  allocation: AllocationBlock,
  trade: TradeBlock,
  account: AccountBlock,
}

export function AnswerComponent({ type }: { type: keyof typeof components }) {
  const Component = components[type]
  return <Component />
}
