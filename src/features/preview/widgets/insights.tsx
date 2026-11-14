import {
  ActivityIcon,
  CalendarIcon,
  HistoryIcon,
  PiggyBankIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { Panel } from "../components/panel"
import { moves, savings, trackRecord } from "../data"

/** Smaller widgets for the bottom row: what moved, money leaks, honesty. */

export function MovesWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="moves"
      title={moves.title}
      icon={ActivityIcon}
      action={
        <span className="text-xs font-medium text-brand">{moves.change}</span>
      }
      className={className}
    >
      <ul className="space-y-3">
        {moves.items.map((move) => (
          <li
            key={move.symbol}
            className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 text-sm"
          >
            <span className="font-medium">{move.symbol}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <span
                className="block h-full rounded-full bg-brand"
                style={{ width: `${move.share}%` }}
              />
            </span>
            <span className="font-medium whitespace-nowrap tabular-nums">
              {move.amount}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-pretty text-muted-foreground">
        {moves.explanation}
      </p>

      <div className="mt-auto border-t border-border pt-4">
        <h3 className="mt-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {moves.upcomingTitle}
        </h3>
        <ul className="mt-2 space-y-2 text-sm">
          {moves.upcoming.map((event) => (
            <li
              key={event.label}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2">
                <CalendarIcon
                  className="size-4 text-muted-foreground"
                  aria-hidden
                />
                {event.label}
              </span>
              <span className="text-muted-foreground">{event.when}</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}

export function SavingsWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="savings"
      title={savings.title}
      description={savings.description}
      icon={PiggyBankIcon}
      className={className}
    >
      <p className="text-3xl font-semibold tracking-tight tabular-nums">
        {savings.total}{" "}
        <span className="text-sm font-normal tracking-normal text-muted-foreground">
          {savings.per}
        </span>
      </p>
      <ul className="mt-3 divide-y divide-border">
        {savings.items.map((item) => (
          <li
            key={item.label}
            className="flex items-start justify-between gap-3 py-3"
          >
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold whitespace-nowrap text-brand tabular-nums">
              {item.amount}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-3">
        <ComingSoonButton variant="outline" className="h-9 w-full rounded-full">
          {savings.cta}
        </ComingSoonButton>
      </div>
    </Panel>
  )
}

export function TrackRecordWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="track-record"
      title={trackRecord.title}
      description={trackRecord.description}
      icon={HistoryIcon}
      className={className}
    >
      <dl className="divide-y divide-border rounded-xl border border-border">
        {trackRecord.stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-baseline justify-between gap-3 px-3 py-2.5"
          >
            <dt className="text-sm text-muted-foreground">
              {stat.label}
              {"hint" in stat && (
                <span className="block text-xs">{stat.hint}</span>
              )}
            </dt>
            <dd
              className={cn(
                "text-lg font-semibold tabular-nums",
                "hint" in stat && "text-brand",
              )}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {trackRecord.missesTitle}
      </h3>
      <ul className="mt-2 space-y-2 text-sm">
        {trackRecord.misses.map((miss) => (
          <li
            key={miss.label}
            className="flex items-center justify-between gap-3"
          >
            <span>{miss.label}</span>
            <span className="shrink-0 font-medium whitespace-nowrap text-destructive tabular-nums">
              {miss.impact}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-4">
        <ComingSoonButton variant="ghost" className="h-9 w-full rounded-full">
          {trackRecord.cta}
        </ComingSoonButton>
      </div>
    </Panel>
  )
}
