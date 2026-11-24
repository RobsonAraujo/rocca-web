"use client"

import {
  ArrowRightIcon,
  BookOpenIcon,
  GaugeIcon,
  LockOpenIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { demoRoutes } from "./constants"
import type { ExperienceLevel } from "./content"
import { onboarding as copy } from "./content"
import { useDemoSession } from "./session"

/**
 * Step 2: one question, how much the visitor has invested. It sets how
 * Rocca explains things (plain English and lessons up front, or straight to
 * the numbers) and previews the starting setup, including the idea the
 * demo is about: Autopilot unlocks rule by rule, as you learn.
 */
export function Onboarding() {
  const router = useRouter()
  const session = useDemoSession()
  const [level, setLevel] = useState<ExperienceLevel | null>(session.level)
  const questionId = useId()

  const startWith = level && [
    {
      icon: BookOpenIcon,
      tone: "text-learn",
      text:
        level === "experienced" ? copy.explain.numbers : copy.explain.simple,
    },
    { icon: GaugeIcon, tone: "text-control", text: copy.mode },
    { icon: ShieldCheckIcon, tone: "text-control", text: copy.starterRules },
    { icon: LockOpenIcon, tone: "text-control", text: copy.autopilot },
  ]

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {copy.title}
      </h1>
      <p
        id={questionId}
        className="mt-1 text-lg text-muted-foreground sm:text-xl"
      >
        {copy.question}
      </p>

      <fieldset aria-labelledby={questionId} className="mt-6 space-y-2.5">
        {copy.levels.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-border transition-shadow has-checked:ring-2 has-checked:ring-brand has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
          >
            <input
              type="radio"
              name="level"
              value={option.id}
              checked={level === option.id}
              onChange={() => setLevel(option.id)}
              className="mt-1 size-4 shrink-0 accent-brand"
            />
            <span>
              <span className="block font-medium">{option.label}</span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {option.description}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      <div aria-live="polite">
        {startWith && (
          <section
            aria-label={copy.startWith}
            className="mt-6 animate-in rounded-xl bg-secondary/60 p-4 duration-300 fade-in slide-in-from-bottom-1"
          >
            <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {copy.startWith}
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {startWith.map(({ icon: Icon, tone, text }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <Icon
                    className={cn("mt-0.5 size-4 shrink-0", tone)}
                    aria-hidden
                  />
                  <span className="text-pretty">{text}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <Button
        type="button"
        disabled={!level}
        onClick={() => {
          if (!level) return
          session.setLevel(level)
          router.push(demoRoutes.connect)
        }}
        className="mt-6 h-11 rounded-xl px-5 text-sm"
      >
        {copy.continue}
        <ArrowRightIcon aria-hidden />
      </Button>
    </div>
  )
}
