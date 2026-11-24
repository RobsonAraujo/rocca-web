"use client"

import {
  CircleAlertIcon,
  CircleCheckIcon,
  GaugeIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { Fragment } from "react"

import { cn } from "@/lib/utils"
import { toneClasses } from "@/components/product/tone"

import { ComingSoonButton } from "../components/coming-soon"
import { Panel } from "../components/panel"
import { autonomy, rules } from "../data"
import type { SuggestionStatus } from "../demo-state"
import { useDemo } from "../demo-state"
import { RuleAutopilotLine } from "./rule-autopilot"

/** The selected level and its position in the switch. */
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
 * How much Rocca handles, as a segmented control: Explain, Suggest,
 * Autopilot, left to right as Rocca takes on more. Every option stays a
 * button (the current one pressed), so focus doesn't drop when it changes.
 */
export function ModeSwitch() {
  const { setMode } = useDemo()
  const { index: currentIndex } = useCurrentLevel()
  return (
    <div
      role="group"
      aria-label={autonomy.title}
      className="grid grid-cols-3 gap-0.5 rounded-lg bg-secondary p-0.5"
    >
      {autonomy.levels.map((level, index) => {
        const current = index === currentIndex
        return (
          <button
            key={level.id}
            type="button"
            onClick={() => setMode(level.id)}
            aria-pressed={current}
            aria-label={
              current ? level.label : `${autonomy.change} ${level.label}`
            }
            className={cn(
              "flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              current
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {current && (
              <span className="size-1.5 rounded-full bg-control" aria-hidden />
            )}
            {level.short}
          </button>
        )
      })}
    </div>
  )
}

/** What the current mode means, then who does what, one line each. */
export function InThisMode() {
  const { inThisMode } = autonomy
  const { level: currentLevel } = useCurrentLevel()
  const split = inThisMode.byLevel[currentLevel.id]
  const sides = [
    { label: inThisMode.labels.rocca, items: split.rocca },
    { label: inThisMode.labels.you, items: split.you },
  ]
  const later = "later" in currentLevel && currentLevel.later
  return (
    <div aria-live="polite">
      <p className="text-[13px] text-pretty text-muted-foreground">
        {currentLevel.description}
      </p>
      {later && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-pretty text-muted-foreground">
          <span
            className={cn(
              "shrink-0 rounded-md px-1.5 py-px text-[11px] font-semibold",
              toneClasses.control.tile,
            )}
          >
            {autonomy.later.tag}
          </span>
          {autonomy.later.note}
        </p>
      )}
      <dl className="mt-3 space-y-1.5 text-[13px] leading-snug">
        {sides.map((side) => (
          <div key={side.label} className="flex gap-3">
            <dt className="w-12 shrink-0 text-muted-foreground">
              {side.label}
            </dt>
            <dd className="min-w-0">
              {side.items.map((item, index) => (
                <Fragment key={item}>
                  {index > 0 && (
                    <span aria-hidden className="text-muted-foreground">
                      {" · "}
                    </span>
                  )}
                  <span>{item}</span>
                </Fragment>
              ))}
            </dd>
          </div>
        ))}
      </dl>
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
            attention
              ? toneClasses.attention.tile
              : "bg-secondary text-muted-foreground",
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
            <li key={rule.id} className="flex items-start gap-2.5 text-sm">
              <Icon
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  attention ? "text-attention" : "text-control",
                )}
                aria-hidden
              />
              {/* A div: the Autopilot line below the rule is block content. */}
              <div className="min-w-0">
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
                {rule.id === rules.autopilot.ruleId && (
                  <RuleAutopilotLine ruleId={rule.id} />
                )}
              </div>
            </li>
          )
        })}
      </ul>
      <ComingSoonButton
        variant="outline"
        size="sm"
        className="mt-4 w-full rounded-lg"
      >
        <PlusIcon aria-hidden />
        {rules.add}
      </ComingSoonButton>
    </div>
  )
}

/**
 * The control differentiator: how much Rocca handles today, what each side
 * does in this mode, and the rules Rocca must follow. Violet marks control,
 * in small doses (the selected mode's dot, the rule icons).
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
        <ModeSwitch />
        <InThisMode />
        <Rules />
      </div>
    </Panel>
  )
}
