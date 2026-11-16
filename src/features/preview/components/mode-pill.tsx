"use client"

import { GaugeIcon } from "lucide-react"

import { toneClasses } from "@/components/product/tone"
import { cn } from "@/lib/utils"

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
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        toneClasses.control.tile,
      )}
    >
      <GaugeIcon className="size-3.5" aria-hidden />
      {status.mode}: {level?.label}
    </span>
  )
}
