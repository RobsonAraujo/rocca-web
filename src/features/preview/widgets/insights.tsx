import {
  ActivityIcon,
  CalendarIcon,
  HistoryIcon,
  PiggyBankIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { Delta } from "../components/delta"
import { Panel, panelLinkClass, panelSection } from "../components/panel"
import { moves, savings, trackRecord } from "../data"

/** Smaller widgets for the overview's lower rows: what moved, money leaks, honesty. */

/** A quiet "coming soon" link for a panel header. */
function HeaderLink({ children }: { children: string }) {
  return (
    <ComingSoonButton variant="link" className={panelLinkClass}>
      {children}
    </ComingSoonButton>
  )
}

export function MovesWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="moves"
      title={moves.title}
      icon={ActivityIcon}
      action={<Delta value={moves.change} className="text-[13px]" />}
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
                className="block h-full rounded-full bg-brand/70"
                style={{ width: `${move.share}%` }}
              />
            </span>
            <Delta value={move.amount} className="justify-self-end" />
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[13px] leading-relaxed text-pretty text-muted-foreground">
        {moves.explanation}
      </p>

      <div className={cn(panelSection, "mt-auto")}>
        <h3 className="text-xs font-medium text-muted-foreground">
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
      action={<HeaderLink>{savings.cta}</HeaderLink>}
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
            className="flex items-start justify-between gap-3 py-3 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold whitespace-nowrap tabular-nums">
              {item.amount}
            </span>
          </li>
        ))}
      </ul>
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
      action={<HeaderLink>{trackRecord.cta}</HeaderLink>}
      className={className}
    >
      {/* Wide panels: the numbers beside the misses; narrow: stacked. */}
      <div className="grid gap-5 md:grid-cols-2 md:gap-8">
        <div>
          <dl className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border">
            {trackRecord.stats.map((stat) => (
              <div key={stat.label} className="min-w-0 px-3 py-2.5">
                <dt className="truncate text-xs text-muted-foreground">
                  {stat.label}
                </dt>
                <dd
                  className={cn(
                    "mt-0.5 text-lg font-semibold tabular-nums",
                    "hint" in stat && "text-brand",
                  )}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          {trackRecord.stats.map(
            (stat) =>
              "hint" in stat && (
                <p
                  key={stat.label}
                  className="mt-2 text-xs text-muted-foreground"
                >
                  {stat.label}: {stat.hint}
                </p>
              ),
          )}
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground">
            {trackRecord.missesTitle}
          </h3>
          <ul className="mt-1 divide-y divide-border text-sm">
            {trackRecord.misses.map((miss) => (
              <li
                key={miss.label}
                className="flex items-center justify-between gap-3 py-2 last:pb-0"
              >
                <span>{miss.label}</span>
                <Delta value={miss.impact} className="shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  )
}
