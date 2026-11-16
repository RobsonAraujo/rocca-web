"use client"

import { ChevronRightIcon, GaugeIcon, ShieldCheckIcon } from "lucide-react"

import { IconTile, toneClasses } from "@/components/product/tone"
import { cn } from "@/lib/utils"

import { autonomy, mobile } from "../data"
import { useDemo } from "../demo-state"
import { resolveRules } from "../widgets/autonomy"
import { SheetTrigger, controlsSheet } from "./sheet"

/** iOS grouped list: mode and rules, both opening the controls sheet. */
export function ControlsGroup() {
  const demo = useDemo()
  const mode = autonomy.levels.find((level) => level.id === demo.mode)
  const attention = resolveRules(demo.suggestion).filter(
    (rule) => rule.status === "attention",
  ).length
  const rows = [
    {
      key: "mode",
      icon: GaugeIcon,
      label: mobile.controls.mode,
      value: mode?.label,
      badge: null,
    },
    {
      key: "rules",
      icon: ShieldCheckIcon,
      label: mobile.controls.rules,
      value: null,
      badge: attention
        ? `${attention} ${mobile.controls.needsAttention}`
        : null,
    },
  ]
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-control/20">
      {rows.map(({ key, icon, label, value, badge }) => (
        <li key={key}>
          <SheetTrigger
            handle={controlsSheet}
            className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-secondary"
          >
            <IconTile
              icon={icon}
              tone="control"
              className="size-8 rounded-lg"
            />
            <span className="flex-1 text-[15px] font-medium">{label}</span>
            {badge && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
                  toneClasses.attention.tile,
                )}
              >
                {badge}
              </span>
            )}
            {value && (
              <span className="text-sm text-muted-foreground">{value}</span>
            )}
            <ChevronRightIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
          </SheetTrigger>
        </li>
      ))}
    </ul>
  )
}
