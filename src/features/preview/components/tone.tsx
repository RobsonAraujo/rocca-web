import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Each idea in the dashboard has its own color, so people can tell them
 * apart at a glance (tokens live in globals.css):
 * - attention: something needs your action
 * - control: autonomy and rules (you decide how much Rocca does)
 * - learn: lessons and plain-English explanations
 * - brand: money and everything else
 */
export type Tone = "brand" | "attention" | "control" | "learn"

/** Full class names (Tailwind can't see dynamically built ones). */
export const toneClasses: Record<
  Tone,
  { tile: string; ring: string; text: string; soft: string; solid: string }
> = {
  brand: {
    tile: "bg-brand/10 text-brand",
    ring: "ring-brand/20",
    text: "text-brand",
    soft: "bg-brand/[0.06]",
    solid: "bg-brand text-brand-foreground hover:bg-brand/90",
  },
  attention: {
    tile: "bg-attention/10 text-attention",
    ring: "ring-attention/30",
    text: "text-attention",
    soft: "bg-attention/[0.06]",
    solid: "bg-attention text-white hover:bg-attention/90",
  },
  control: {
    tile: "bg-control/10 text-control",
    ring: "ring-control/25",
    text: "text-control",
    soft: "bg-control/[0.06]",
    solid: "bg-control text-white hover:bg-control/90",
  },
  learn: {
    tile: "bg-learn/10 text-learn",
    ring: "ring-learn/25",
    text: "text-learn",
    soft: "bg-learn/[0.06]",
    solid: "bg-learn text-white hover:bg-learn/90",
  },
}

/** Icon on a soft square of its tone: the identity mark of a widget. */
export function IconTile({
  icon: Icon,
  tone,
  className,
}: {
  icon: LucideIcon
  tone: Tone
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-xl",
        toneClasses[tone].tile,
        className,
      )}
    >
      <Icon className="size-[1.125rem]" />
    </span>
  )
}
