import { cn } from "@/lib/utils"

type ProgressRingProps = {
  done: number
  total: number
  /** Size and color come from the caller, e.g. "size-16 text-learn". */
  className?: string
}

/**
 * Circular progress with "done/total" in the middle. The ring is drawn with
 * r=15.915 (circumference 100), so the dash length is the percentage.
 * Shared by the landing's Learn card and the dashboard's Learn widget.
 */
export function ProgressRing({ done, total, className }: ProgressRingProps) {
  const percent = Math.round((done / total) * 100)
  return (
    <div
      role="progressbar"
      aria-label="Lessons completed"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      className={cn("relative size-16 shrink-0 text-learn", className)}
    >
      <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden>
        <circle
          cx="18"
          cy="18"
          r="15.915"
          fill="none"
          strokeWidth="3.5"
          stroke="currentColor"
          strokeOpacity={0.15}
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
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-semibold text-foreground tabular-nums">
        {done}/{total}
      </span>
    </div>
  )
}
