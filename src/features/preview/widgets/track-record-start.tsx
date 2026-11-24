"use client"

import { HistoryIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Panel } from "../components/panel"
import { trackRecord } from "../data"
import { useDemo } from "../demo-state"

const { firstRun } = trackRecord
const [suggestionsStat, approvedStat, impactStat] = trackRecord.stats

/** Counts from this visit: the one suggestion, and whether you approved it. */
function useCounts() {
  const { suggestion } = useDemo()
  return { suggestions: 1, approved: suggestion === "done" ? 1 : 0 }
}

/**
 * The track record of a brand-new account (the recordable demo): it starts
 * today, counts this visit's one suggestion, and promises the misses will
 * show. Same frame as the regular widget, so the page doesn't jump.
 */
export function TrackRecordStart({ className }: { className?: string }) {
  const counts = useCounts()
  const stats = [
    { label: suggestionsStat.label, value: String(counts.suggestions) },
    { label: approvedStat.label, value: String(counts.approved) },
    { label: impactStat.label, value: firstRun.impactValue },
  ]
  return (
    <Panel
      id="track-record"
      title={trackRecord.title}
      description={firstRun.description}
      icon={HistoryIcon}
      className={className}
    >
      <div className="grid gap-5 md:grid-cols-2 md:gap-8">
        <div>
          <dl className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0 px-3 py-2.5">
                <dt className="truncate text-xs text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="mt-0.5 truncate text-lg font-semibold tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-muted-foreground">
            {firstRun.impactHint}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-muted-foreground">
            {trackRecord.missesTitle}
          </h3>
          <p className="mt-2 text-sm text-pretty text-muted-foreground">
            {firstRun.noMisses}
          </p>
        </div>
      </div>
    </Panel>
  )
}

/** The phone card version (the "For you" carousel). */
export function TrackCardStart({ className }: { className?: string }) {
  const counts = useCounts()
  return (
    <article className={cn("bg-card ring-border", className)}>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <HistoryIcon className="size-4" aria-hidden />
        {trackRecord.title}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {firstRun.impact}
      </p>
      <p className="text-xs text-muted-foreground">
        {firstRun.summary(counts.suggestions, counts.approved)}
      </p>
      <p className="mt-2 text-xs text-pretty text-muted-foreground">
        {firstRun.noMisses}
      </p>
    </article>
  )
}
