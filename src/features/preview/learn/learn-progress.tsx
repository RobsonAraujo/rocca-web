"use client"

import { CheckIcon } from "lucide-react"
import Link from "next/link"

import { ProgressRing } from "@/components/product/progress-ring"
import { cn } from "@/lib/utils"

import { LEARN_PATH } from "../constants"
import { learn } from "../data"
import { useDemo } from "../demo-state"
import { LESSON_ID, concepts } from "./data"
import { LessonButton } from "./open-lesson"
import { learnSummary } from "./progress"

/**
 * Small client islands for the Learn widgets (desktop strip, phone card),
 * so the widgets themselves stay server components: they follow what
 * you've learned in this visit.
 */

export function useLearnSummary() {
  const { learned } = useDemo()
  return learnSummary(learned)
}

/** Ring with "done/total", and optionally the percent beside it. */
export function LearnRing({
  className,
  withLabel = false,
}: {
  className?: string
  withLabel?: boolean
}) {
  const { done, total } = useLearnSummary()
  const ring = <ProgressRing done={done} total={total} className={className} />
  if (!withLabel) return ring
  return (
    <div className="flex items-center gap-3">
      {ring}
      <div>
        <p className="text-xl font-semibold tracking-tight tabular-nums">
          {Math.round((done / total) * 100)}%
        </p>
        <p className="text-xs text-muted-foreground">
          {done} {learn.progressLabel(done)}
        </p>
      </div>
    </div>
  )
}

type StartProps = Omit<React.ComponentProps<typeof LessonButton>, "children">

/** "Start lesson", or "Review lesson" once it's learned. */
export function StartLessonButton({
  icon,
  ...props
}: StartProps & { icon?: React.ReactNode }) {
  const { learned } = useDemo()
  return (
    <LessonButton {...props}>
      {icon}
      {learned.includes(LESSON_ID) ? learn.review : learn.next.cta}
    </LessonButton>
  )
}

/** The course's concepts; each links to its card on the Learn page. */
export function ConceptChips() {
  const { learned } = useDemo()
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {concepts.map(({ id, label }) => {
        const done = learned.includes(id)
        return (
          <li key={id}>
            <Link
              href={`${LEARN_PATH}#${id}`}
              aria-label={done ? `${label}, ${learn.learned}` : label}
              className={cn(
                "inline-flex h-6 items-center gap-1 rounded-md border px-2 text-xs font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                done
                  ? "border-border text-foreground"
                  : "border-dashed border-border text-muted-foreground",
              )}
            >
              {done && <CheckIcon className="size-3 text-learn" aria-hidden />}
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
