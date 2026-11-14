import {
  CheckIcon,
  GraduationCapIcon,
  PlayIcon,
  SparklesIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { Panel } from "../components/panel"
import { toneClasses } from "../components/tone"
import { learn } from "../data"

/** r=15.915 gives a circumference of 100, so the dash is the percentage. */
function ProgressRing({ percent }: { percent: number }) {
  return (
    <svg viewBox="0 0 36 36" className="size-16 -rotate-90" aria-hidden>
      <circle
        cx="18"
        cy="18"
        r="15.915"
        fill="none"
        strokeWidth="3.5"
        stroke="currentColor"
        className="text-learn/15"
      />
      <circle
        cx="18"
        cy="18"
        r="15.915"
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        stroke="currentColor"
        strokeDasharray={`${percent} ${100 - percent}`}
        className="text-learn"
      />
    </svg>
  )
}

/**
 * The beginner differentiator: Rocca handles the money and teaches along the
 * way, with lessons picked from what you actually own. Blue = learning.
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
      <div className="flex items-center gap-4">
        <div
          role="progressbar"
          aria-label="Lessons completed"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          className="relative shrink-0"
        >
          <ProgressRing percent={percent} />
          <span className="absolute inset-0 grid place-items-center text-sm font-semibold tabular-nums">
            {done}/{total}
          </span>
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {percent}%
          </p>
          <p className="text-sm text-muted-foreground">
            {done} {learn.progressLabel}
          </p>
        </div>
      </div>

      <div className={cn("mt-5 rounded-2xl p-4", toneClasses.learn.soft)}>
        <p className={cn("text-xs font-semibold", toneClasses.learn.text)}>
          {learn.next.meta}
        </p>
        <h3 className="mt-1 font-semibold tracking-tight text-balance">
          {learn.next.title}
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
          <SparklesIcon
            className={cn("mt-px size-3.5 shrink-0", toneClasses.learn.text)}
            aria-hidden
          />
          {learn.next.reason}
        </p>
        <ComingSoonButton
          size="sm"
          className={cn("mt-4 rounded-full px-3.5", toneClasses.learn.solid)}
        >
          <PlayIcon aria-hidden />
          {learn.next.cta}
        </ComingSoonButton>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
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
              "rounded-full px-2.5",
              learned
                ? "border-learn/20 bg-learn/10 text-learn hover:bg-learn/15 hover:text-learn"
                : "border-dashed",
            )}
          >
            {learned && <CheckIcon aria-hidden />}
            {label}
          </ComingSoonButton>
        ))}
      </div>
    </Panel>
  )
}
