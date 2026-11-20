import {
  CheckIcon,
  GraduationCapIcon,
  PlayIcon,
  SparklesIcon,
} from "lucide-react"

import { ProgressRing } from "@/components/product/progress-ring"
import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { Panel } from "../components/panel"
import { learn } from "../data"

/**
 * The beginner differentiator: Rocca handles the money and teaches along the
 * way, with lessons picked from what you actually own. A full-width strip:
 * progress, the next lesson, then the concepts (stacked on narrow screens).
 * Blue marks learning, in small doses (the ring and icons).
 */
export function LearnWidget({ className }: { className?: string }) {
  const { done, total } = learn.progress
  const percent = Math.round((done / total) * 100)
  return (
    <Panel
      id="learn"
      title={learn.title}
      description={learn.description}
      icon={GraduationCapIcon}
      tone="learn"
      className={className}
    >
      <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex items-center gap-3">
          <ProgressRing done={done} total={total} className="size-14" />
          <div>
            <p className="text-xl font-semibold tracking-tight tabular-nums">
              {percent}%
            </p>
            <p className="text-xs text-muted-foreground">
              {done} {learn.progressLabel}
            </p>
          </div>
        </div>

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
          <ComingSoonButton
            variant="outline"
            size="sm"
            className="mt-3 rounded-lg px-3"
          >
            <PlayIcon className="text-learn" aria-hidden />
            {learn.next.cta}
          </ComingSoonButton>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium text-muted-foreground">
            {learn.conceptsLabel}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {learn.concepts.map(({ label, done: learned }) => (
              <ComingSoonButton
                key={label}
                variant="outline"
                size="xs"
                aria-label={learned ? `${label}, ${learn.learned}` : label}
                className={cn(
                  "rounded-md px-2",
                  learned
                    ? "text-foreground"
                    : "border-dashed text-muted-foreground",
                )}
              >
                {learned && <CheckIcon className="text-learn" aria-hidden />}
                {label}
              </ComingSoonButton>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}
