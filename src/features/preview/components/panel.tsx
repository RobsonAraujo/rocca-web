import type { LucideIcon } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

import type { Tone } from "./tone"
import { IconTile, toneClasses } from "./tone"

/** Card chrome shared by every dashboard widget (same look as the landing bento). */
export const panelClass =
  "rounded-2xl shadow-soft [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]"

type PanelProps = {
  /** Unique slug; the heading gets `${id}-title` and labels the region. */
  id: string
  title: string
  description?: string
  icon?: LucideIcon
  /**
   * Gives the widget its own identity: icon on a colored tile and a tinted
   * outline. Use it for the differentiators; leave it off for the rest.
   */
  tone?: Tone
  /** Rendered top-right of the header (a chip, tabs, a small button). */
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function Panel({
  id,
  title,
  description,
  icon: Icon,
  tone,
  action,
  className,
  children,
}: PanelProps) {
  const titleId = `${id}-title`

  const heading = (
    <CardTitle>
      <h2
        id={titleId}
        className={cn(
          "flex items-center gap-2 font-semibold tracking-tight",
          tone ? "text-lg" : "text-base",
        )}
      >
        {Icon && !tone && (
          <Icon className="size-4 shrink-0 text-brand" aria-hidden />
        )}
        {title}
      </h2>
    </CardTitle>
  )

  return (
    <Card
      role="region"
      aria-labelledby={titleId}
      className={cn(panelClass, tone && toneClasses[tone].ring, className)}
    >
      <CardHeader>
        {tone && Icon ? (
          <div className="flex items-start gap-3">
            <IconTile icon={Icon} tone={tone} />
            <div className="min-w-0 space-y-0.5">
              {heading}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </div>
        ) : (
          <>
            {heading}
            {description && <CardDescription>{description}</CardDescription>}
          </>
        )}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">{children}</CardContent>
    </Card>
  )
}
