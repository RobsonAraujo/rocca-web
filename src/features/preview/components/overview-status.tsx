"use client"

import { status } from "../data"
import { useDemo } from "../demo-state"

/**
 * The overview's subtitle, the way dashboards open: where the numbers come
 * from, how fresh they are, and whether anything waits on you. It follows
 * the demo, so approving or skipping the suggestion clears the count.
 */
export function OverviewStatus() {
  const { suggestion } = useDemo()
  const waiting = suggestion === "pending"
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
      <span>{status.data}</span>
      <span aria-hidden>·</span>
      <span>{status.updated}</span>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1.5">
        {waiting && (
          <span className="size-1.5 rounded-full bg-attention" aria-hidden />
        )}
        <span className={waiting ? "font-medium text-foreground" : undefined}>
          {waiting ? status.waiting : status.clear}
        </span>
      </span>
    </span>
  )
}
