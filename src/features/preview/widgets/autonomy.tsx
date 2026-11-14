import {
  CircleAlertIcon,
  CircleCheckIcon,
  GaugeIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { Panel } from "../components/panel"
import { autonomy, rules } from "../data"

type Level = (typeof autonomy.levels)[number]

/** Radio-style row. Only the current level is "selected"; the others are previews. */
function LevelBody({ level, current }: { level: Level; current: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
          current ? "border-brand" : "border-input",
        )}
      >
        {current && <span className="size-2 rounded-full bg-brand" />}
      </span>
      <span className="min-w-0 text-left whitespace-normal">
        <span className="block text-sm font-medium text-foreground">
          {level.label}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
          {level.description}
        </span>
      </span>
    </>
  )
}

export function AutonomyWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="autonomy"
      title={autonomy.title}
      description={autonomy.description}
      icon={GaugeIcon}
      className={className}
    >
      <ul className="space-y-2">
        {autonomy.levels.map((level) => {
          const current = level.id === autonomy.current
          return (
            <li key={level.id}>
              {current ? (
                <div
                  aria-current="true"
                  className="flex items-start gap-3 rounded-xl border border-brand/30 bg-brand/[0.05] p-3"
                >
                  <LevelBody level={level} current />
                </div>
              ) : (
                <ComingSoonButton
                  variant="ghost"
                  className="h-auto w-full items-start justify-start gap-3 rounded-xl border border-border p-3 font-normal"
                >
                  <LevelBody level={level} current={false} />
                </ComingSoonButton>
              )}
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

/** Plain-English guardrails Rocca must follow; the NVDA one is what triggered the suggestion. */
export function RulesWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="rules"
      title={rules.title}
      description={rules.description}
      icon={ShieldCheckIcon}
      className={className}
    >
      <div>
        <ul className="space-y-3">
          {rules.items.map((rule) => {
            const attention = rule.status === "attention"
            const Icon = attention ? CircleAlertIcon : CircleCheckIcon
            return (
              <li key={rule.label} className="flex items-start gap-2.5 text-sm">
                <Icon
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    attention ? "text-amber-600" : "text-brand",
                  )}
                  aria-hidden
                />
                <span>
                  <span className="sr-only">
                    {attention ? "Needs attention: " : "On track: "}
                  </span>
                  <span className="block font-medium">{rule.label}</span>
                  <span
                    className={cn(
                      "block text-xs",
                      attention ? "text-amber-700" : "text-muted-foreground",
                    )}
                  >
                    {rule.detail}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
        <ComingSoonButton
          variant="outline"
          size="sm"
          className="mt-5 w-full rounded-full"
        >
          <PlusIcon aria-hidden />
          {rules.add}
        </ComingSoonButton>
      </div>
    </Panel>
  )
}
