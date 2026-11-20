import { cn } from "@/lib/utils"

import { Delta } from "./delta"

/**
 * A headline number with its label and either a change (`delta`) or a
 * quiet hint. Renders <dt>/<dd>, so place it inside a <dl>.
 */
export function Stat({
  label,
  value,
  delta,
  hint,
  className,
}: {
  label: string
  value: string
  /** A signed change ("+$8,190"), shown with its arrow and color. */
  delta?: string
  /** Shown after the delta, or alone in muted text. */
  hint?: string
  className?: string
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-[13px] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums max-md:text-base">
        {value}
      </dd>
      {(delta || hint) && (
        <dd className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
          {delta && <Delta value={delta} />}
          {hint}
        </dd>
      )}
    </div>
  )
}
