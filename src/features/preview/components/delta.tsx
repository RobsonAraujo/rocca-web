import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type Direction = "up" | "down" | "flat"

/** "+$4,390" is up, "−$320" (or "-$320") is down, anything else is flat. */
export function directionOf(text: string): Direction {
  if (text.startsWith("+")) return "up"
  if (text.startsWith("−") || text.startsWith("-")) return "down"
  return "flat"
}

const toneClass: Record<Direction, string> = {
  up: "text-brand",
  down: "text-destructive",
  flat: "text-muted-foreground",
}

/**
 * A change in money or percent. Gains and losses never rely on color
 * alone: the sign stays in the text and an arrow points the way.
 * Pass several values as children (e.g. amount and percent) when they
 * share one direction; `direction` defaults to the sign of `value`.
 */
export function Delta({
  value,
  direction = directionOf(value),
  children,
  className,
}: {
  value: string
  direction?: Direction
  /** Extra text after the value, e.g. "(+3.4%)". */
  children?: React.ReactNode
  className?: string
}) {
  const Arrow = direction === "down" ? ArrowDownIcon : ArrowUpIcon
  return (
    <span
      data-direction={direction}
      className={cn(
        "inline-flex items-center gap-1 font-medium whitespace-nowrap tabular-nums",
        toneClass[direction],
        className,
      )}
    >
      {direction !== "flat" && (
        <Arrow
          className="size-[0.9em] shrink-0"
          strokeWidth={2.5}
          aria-hidden
        />
      )}
      <span>{value}</span>
      {children}
    </span>
  )
}
