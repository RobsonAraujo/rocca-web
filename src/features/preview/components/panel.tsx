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

/** Card chrome shared by every dashboard widget (same look as the landing bento). */
export const panelClass =
  "rounded-2xl shadow-soft [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]"

type PanelProps = {
  /** Unique slug; the heading gets `${id}-title` and labels the region. */
  id: string
  title: string
  description?: string
  icon?: LucideIcon
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
  action,
  className,
  children,
}: PanelProps) {
  const titleId = `${id}-title`
  return (
    <Card
      role="region"
      aria-labelledby={titleId}
      className={cn(panelClass, className)}
    >
      <CardHeader>
        <CardTitle>
          <h2
            id={titleId}
            className="flex items-center gap-2 text-base font-semibold tracking-tight"
          >
            {Icon && (
              <Icon className="size-4 shrink-0 text-brand" aria-hidden />
            )}
            {title}
          </h2>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">{children}</CardContent>
    </Card>
  )
}
