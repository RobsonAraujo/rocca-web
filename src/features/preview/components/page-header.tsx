import { cn } from "@/lib/utils"

import { SimulatedBadge } from "./navigation"

type PageHeaderProps = {
  title: string
  subtitle: string
  /** Optional controls on the right (desktop) or below the text (phones). */
  actions?: React.ReactNode
  className?: string
}

/** Page title block shared by the preview pages: compact, like an app's. */
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
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {/* The top bar only has room for the badge on wide screens. */}
        <SimulatedBadge className="w-fit xl:hidden" />
        {actions}
      </div>
    </div>
  )
}
