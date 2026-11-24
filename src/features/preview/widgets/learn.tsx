import { GraduationCapIcon, PlayIcon, SparklesIcon } from "lucide-react"

import { Panel } from "../components/panel"
import { learn } from "../data"
import {
  ConceptChips,
  LearnRing,
  StartLessonButton,
  StreakPill,
} from "../learn/learn-progress"

/**
 * The beginner differentiator: Rocca handles the money and teaches along the
 * way, with lessons picked from what you actually own. A full-width strip:
 * progress, the next lesson, then the concepts (stacked on narrow screens).
 * Blue marks learning, in small doses (the ring and icons). The ring,
 * button and chips are client islands that follow the lesson.
 */
export function LearnWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="learn"
      title={learn.title}
      description={learn.description}
      icon={GraduationCapIcon}
      tone="learn"
      action={<StreakPill />}
      className={className}
    >
      <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
        <LearnRing className="size-14" withLabel />

        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">{learn.next.meta}</p>
          <h3 className="mt-1 text-sm font-semibold tracking-tight text-balance">
            {learn.next.title}
          </h3>
          <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
            <SparklesIcon
              className="mt-px size-3.5 shrink-0 text-learn"
              aria-hidden
            />
            {learn.next.reason}
          </p>
          <StartLessonButton
            variant="outline"
            size="sm"
            className="mt-3 rounded-lg px-3"
            icon={<PlayIcon className="text-learn" aria-hidden />}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium text-muted-foreground">
            {learn.conceptsLabel}
          </p>
          <ConceptChips />
        </div>
      </div>
    </Panel>
  )
}
