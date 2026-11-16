"use client"

import {
  CheckIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  GaugeIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toneClasses } from "@/components/product/tone"

import { ComingSoonButton } from "../components/coming-soon"
import { Panel } from "../components/panel"
import { autonomy, rules } from "../data"
import type { SuggestionStatus } from "../demo-state"
import { useDemo } from "../demo-state"

/** The selected level and its position on the dial. */
function useCurrentLevel() {
  const { mode } = useDemo()
  const index = autonomy.levels.findIndex((level) => level.id === mode)
  return { index, level: autonomy.levels[index]! }
}

/**
 * Rules as they stand in the demo: approving the NVDA trim puts the 12% rule
 * back on track.
 */
export function resolveRules(suggestion: SuggestionStatus) {
  return rules.items.map((rule) =>
    suggestion === "done" && "resolvedDetail" in rule
      ? { ...rule, status: "ok" as const, detail: rule.resolvedDetail }
      : rule,
  )
}

/**
 * A three-stop dial: the filled part of the track is how much Rocca handles
 * today. Tapping another stop switches the (simulated) mode.
 */
export function AutonomyDial() {
  const { setMode } = useDemo()
  const { index: currentIndex } = useCurrentLevel()
  const last = autonomy.levels.length - 1
  const fill = (currentIndex / last) * 100
  return (
    <div className={cn("rounded-2xl p-4 sm:p-5", toneClasses.control.soft)}>
      <div className="relative mx-2.5 h-5">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-control/15" />
        <div
          className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-control transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${fill}%` }}
        />
        {autonomy.levels.map((level, index) => {
          const position = { left: `${(index / last) * 100}%` }
          const current = index === currentIndex
          // Every stop stays a button (the current one pressed), so focus
          // doesn't drop when the mode changes.
          return (
            <Button
              key={level.id}
              type="button"
              variant="ghost"
              onClick={() => setMode(level.id)}
              aria-pressed={current}
              aria-label={
                current ? level.label : `${autonomy.change} ${level.label}`
              }
              style={position}
              className={cn(
                // active:-translate-y-1/2 cancels the Button's press nudge, which would knock the stop off the track.
                // The ::after pseudo widens the tap target past the small dot.
                "absolute top-1/2 min-w-0 -translate-x-1/2 -translate-y-1/2 rounded-full p-0 after:absolute after:-inset-3 after:content-[''] active:-translate-y-1/2",
                current
                  ? "size-5 border-4 border-card bg-control shadow-soft ring-4 ring-control/20 hover:bg-control"
                  : cn(
                      "size-4 border-2 hover:bg-card",
                      index < currentIndex
                        ? "border-control bg-control"
                        : "border-control/40 bg-card",
                    ),
              )}
            />
          )
        })}
      </div>
      <ul className="mt-3 grid grid-cols-3 text-xs">
        {autonomy.levels.map((level, index) => (
          <li
            key={level.id}
            aria-current={index === currentIndex ? "true" : undefined}
            className={cn(
              "transition-colors",
              index === 0 && "text-left",
              index === 1 && "text-center",
              index === 2 && "text-right",
              index === currentIndex
                ? "font-semibold text-control"
                : "text-muted-foreground",
            )}
          >
            {level.short}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function InThisMode() {
  const { inThisMode } = autonomy
  const { level: currentLevel } = useCurrentLevel()
  const split = inThisMode.byLevel[currentLevel.id]
  const sides = [
    { label: inThisMode.labels.rocca, items: split.rocca },
    { label: inThisMode.labels.you, items: split.you },
  ]
  return (
    <div aria-live="polite">
      <p className="text-sm font-semibold">{currentLevel.label}</p>
      <p className="mt-0.5 text-sm text-pretty text-muted-foreground">
        {currentLevel.description}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {sides.map((side) => (
          <div key={side.label} className="rounded-xl border border-border p-3">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              {side.label}
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {side.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-1.5 text-xs leading-snug"
                >
                  <CheckIcon
                    className="mt-px size-3.5 shrink-0 text-control"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Rules() {
  const { suggestion } = useDemo()
  const items = resolveRules(suggestion)
  const attention = items.some((rule) => rule.status === "attention")
  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheckIcon className="size-4 text-control" aria-hidden />
          {rules.title}
        </h3>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
            attention ? toneClasses.attention.tile : toneClasses.control.tile,
          )}
        >
          {attention ? rules.attentionCount : rules.allClear}
        </span>
      </div>
      <ul className="mt-3 space-y-2.5">
        {items.map((rule) => {
          const attention = rule.status === "attention"
          const Icon = attention ? CircleAlertIcon : CircleCheckIcon
          return (
            <li key={rule.label} className="flex items-start gap-2.5 text-sm">
              <Icon
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  attention ? "text-attention" : "text-control",
                )}
                aria-hidden
              />
              <span className="min-w-0">
                <span className="sr-only">
                  {attention ? "Needs attention: " : "On track: "}
                </span>
                <span className="font-medium">{rule.label}</span>{" "}
                <span
                  className={cn(
                    "text-xs",
                    attention
                      ? "font-medium text-attention"
                      : "text-muted-foreground",
                  )}
                >
                  · {rule.detail}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
      <ComingSoonButton
        variant="outline"
        size="sm"
        className="mt-4 w-full rounded-full"
      >
        <PlusIcon aria-hidden />
        {rules.add}
      </ComingSoonButton>
    </div>
  )
}

/**
 * The control differentiator: how much Rocca handles today, what each side
 * does in this mode, and the rules Rocca must follow. Violet = control.
 */
export function AutonomyWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="autonomy"
      title={autonomy.title}
      description={autonomy.description}
      icon={GaugeIcon}
      tone="control"
      className={className}
    >
      <div className="space-y-5">
        <AutonomyDial />
        <InThisMode />
        <Rules />
      </div>
    </Panel>
  )
}
