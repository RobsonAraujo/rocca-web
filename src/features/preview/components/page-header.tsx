import { cn } from "@/lib/utils"

import { SimulatedBadge } from "./navigation"

type PageHeaderProps = {
  title: string
  subtitle: string
  /** Optional buttons on the right (desktop) or below the text (phones). */
  actions?: React.ReactNode
  className?: string
}

/** Page title block shared by the preview pages. */
export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {/* The top bar hides the badge on phones, so it shows here instead. */}
        <SimulatedBadge className="w-fit sm:hidden" />
        {actions}
      </div>
    </div>
  )
}
