"use client"

import { GaugeIcon } from "lucide-react"

import { autonomy, status } from "../data"
import { useDemo } from "../demo-state"

/**
 * Current autonomy mode, at a glance. It follows the simulated mode, so
 * switching it on the dial updates the page header too.
 */
export function ModePill() {
  const { mode } = useDemo()
  const level = autonomy.levels.find((item) => item.id === mode)
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-medium">
      <GaugeIcon className="size-3.5 text-control" aria-hidden />
      {`${status.mode}: ${level?.label}`}
    </span>
  )
}
