import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-lg bg-brand text-sm font-bold text-brand-foreground"
      >
        R
      </span>
      {siteConfig.name}
    </span>
  )
}
