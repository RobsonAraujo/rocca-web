import { GraduationCapIcon, PlayIcon, SparklesIcon } from "lucide-react"

import { ComingSoonButton } from "../components/coming-soon"
import { Panel } from "../components/panel"
import { learn } from "../data"

/** The beginner angle: Rocca handles the money and teaches along the way. */
export function LearnWidget({ className }: { className?: string }) {
  const { done, total } = learn.progress
  const percent = Math.round((done / total) * 100)
  return (
    <Panel
      id="learn"
      title={learn.title}
      description={learn.description}
      icon={GraduationCapIcon}
      className={className}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">
          {done} of {total} lessons
        </span>
        <span className="text-muted-foreground tabular-nums">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Lessons completed"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4">
        <p className="text-xs text-muted-foreground">{learn.next.meta}</p>
        <h3 className="mt-1 font-semibold tracking-tight text-balance">
          {learn.next.title}
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-brand">
          <SparklesIcon className="mt-px size-3.5 shrink-0" aria-hidden />
          {learn.next.reason}
        </p>
        <ComingSoonButton size="sm" className="mt-4 rounded-full px-3">
          <PlayIcon aria-hidden />
          {learn.next.cta}
        </ComingSoonButton>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        {learn.conceptsLabel}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {learn.concepts.map((concept) => (
          <ComingSoonButton
            key={concept}
            variant="outline"
            size="xs"
            className="rounded-full px-2.5"
          >
            {concept}
          </ComingSoonButton>
        ))}
      </div>
    </Panel>
  )
}
