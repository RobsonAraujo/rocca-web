"use client"

import { Switch } from "@base-ui/react/switch"
import { CheckIcon, CircleIcon, LockIcon, LockOpenIcon } from "lucide-react"

import { toneClasses } from "@/components/product/tone"
import { cn } from "@/lib/utils"

import type { RuleId } from "../data"
import { autonomy, rules } from "../data"
import type { SuggestionStatus } from "../demo-state"
import { useDemo } from "../demo-state"
import type { ConceptId } from "../learn/data"
import { LessonButton } from "../learn/open-lesson"

const { autopilot } = rules

export type RuleAutopilotState = "locked" | "needsApproval" | "ready" | "on"

/**
 * Where a rule is on the way to Autopilot. You earn it: learn the concept
 * behind the rule, approve one of its trades yourself, then turn it on.
 * Only the 12% rule has a path in the preview; the others stay locked.
 */
export function ruleAutopilot(
  state: {
    learned: readonly ConceptId[]
    suggestion: SuggestionStatus
    autopilotRules: readonly RuleId[]
  },
  ruleId: RuleId,
): RuleAutopilotState {
  if (state.autopilotRules.includes(ruleId)) return "on"
  if (ruleId !== autopilot.ruleId) return "locked"
  if (!state.learned.includes(autopilot.unlockedBy)) return "locked"
  if (state.suggestion !== "done") return "needsApproval"
  return "ready"
}

/** "Later" chip and the after-launch note: Autopilot isn't live yet. */
function LaterNote() {
  return (
    <p className="flex items-start gap-1.5 text-[11px] text-pretty text-muted-foreground">
      <span
        className={cn(
          "shrink-0 rounded-md px-1.5 py-px font-semibold",
          toneClasses.control.tile,
        )}
      >
        {autonomy.later.tag}
      </span>
      {autopilot.note}
    </p>
  )
}

/**
 * The Autopilot line under the 12% rule, in the desktop widget and the
 * phone controls sheet: locked → almost (learned, approve one trim) →
 * a switch to turn it on.
 */
export function RuleAutopilotLine({ ruleId }: { ruleId: RuleId }) {
  const demo = useDemo()
  const state = ruleAutopilot(demo, ruleId)

  if (state === "locked") {
    return (
      <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground">
        <LockIcon className="size-3.5 shrink-0" aria-hidden />
        {autopilot.locked}
        <LessonButton
          variant="link"
          className="h-auto p-0 text-xs font-medium text-learn"
        >
          {autopilot.lockedCta}
        </LessonButton>
      </p>
    )
  }

  if (state === "needsApproval") {
    return (
      <div className="mt-1.5 text-xs">
        <p className="text-muted-foreground">{autopilot.almost}</p>
        <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
          <li className="flex items-center gap-1 font-medium text-learn">
            <CheckIcon className="size-3.5" aria-hidden />
            <span className="sr-only">Done: </span>
            {autopilot.steps.learn}
          </li>
          <li className="flex items-center gap-1 text-muted-foreground">
            <CircleIcon className="size-3" aria-hidden />
            <span className="sr-only">To do: </span>
            {autopilot.steps.approve}
          </li>
        </ul>
      </div>
    )
  }

  const on = state === "on"
  return (
    <div
      className={cn(
        "mt-2 space-y-2 rounded-lg p-3 ring-1",
        toneClasses.control.soft,
        toneClasses.control.ring,
      )}
    >
      <label className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-[13px] font-medium">
          <LockOpenIcon
            className="size-3.5 shrink-0 text-control"
            aria-hidden
          />
          {autopilot.toggle}
        </span>
        <Switch.Root
          checked={on}
          onCheckedChange={(checked) => demo.setRuleAutopilot(ruleId, checked)}
          className="inline-flex h-5 w-9 shrink-0 rounded-full bg-muted-foreground/30 p-0.5 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:bg-control"
        >
          <Switch.Thumb className="size-4 rounded-full bg-white shadow-sm transition-transform duration-150 motion-reduce:transition-none data-checked:translate-x-4" />
        </Switch.Root>
      </label>
      <p
        aria-live="polite"
        className="text-xs text-pretty text-muted-foreground"
      >
        {on ? autopilot.on : autopilot.ready}
      </p>
      <LaterNote />
    </div>
  )
}
