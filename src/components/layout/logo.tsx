import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/**
 * Brand mark: three balanced stones (a cairn). "Rocca" means rock, and a
 * balanced stack stands for a well-balanced portfolio. Drawn in `currentColor`
 * so it follows the brand token of whichever layout renders it.
 * Keep in sync with app/icon.svg (the favicon).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
      className={cn("size-7 shrink-0 text-brand", className)}
    >
      <ellipse cx="16" cy="24.5" rx="13" ry="5" />
      <ellipse
        cx="15.25"
        cy="14.25"
        rx="9.5"
        ry="4"
        transform="rotate(-5 15.25 14.25)"
      />
      <ellipse cx="16.75" cy="5.75" rx="5.5" ry="3.25" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-lg font-semibold tracking-tight",
        className,
      )}
    >
      <LogoMark />
      {siteConfig.name}
    </span>
  )
}
