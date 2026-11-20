import type { LucideIcon } from "lucide-react"

import type { Tone } from "@/components/product/tone"
import { toneClasses } from "@/components/product/tone"
import { cn } from "@/lib/utils"

/**
 * Surface shared by every dashboard widget: white on the app canvas, a
 * hairline border and no shadow (the sober, Mercury/Stripe look). Sections
 * inside a panel are split by hairlines, not nested boxes.
 */
export const panelClass =
  "rounded-xl border border-border bg-card text-card-foreground"

/** Horizontal padding of a panel; full-bleed rows use the negative margin. */
export const panelPadding = "px-5"

/** A full-width hairline section inside a panel's body. */
export const panelSection = "-mx-5 mt-5 border-t border-border px-5 pt-4"

/** Small text link or button in a panel header ("See full history"). */
export const panelLinkClass =
  "inline-flex h-auto items-center gap-1 rounded-sm p-0 text-[13px] font-medium whitespace-nowrap text-brand outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"

type PanelProps = {
  /** Unique slug: the panel's id (an anchor), and `${id}-title` labels the region. */
  id: string
  title: string
  description?: string
  icon?: LucideIcon
  /**
   * The widget's idea (control, learn…). Only its icon takes the color:
   * the panel itself stays neutral, so the page keeps a single accent.
   */
  tone?: Tone
  /** Rendered top-right of the header (a link, tabs, a small chip). */
  action?: React.ReactNode
  className?: string
  /** Classes for the body (below the header). */
  bodyClassName?: string
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
  bodyClassName,
  children,
}: PanelProps) {
  const titleId = `${id}-title`
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(panelClass, "flex scroll-mt-24 flex-col", className)}
    >
      <header
        className={cn(
          "flex items-start justify-between gap-4 pt-4",
          panelPadding,
        )}
      >
        <div className="min-w-0">
          <h2
            id={titleId}
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            {Icon && (
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  tone ? toneClasses[tone].text : "text-muted-foreground",
                )}
                aria-hidden
              />
            )}
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div
        className={cn(
          "flex flex-1 flex-col pt-4 pb-5",
          panelPadding,
          bodyClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
