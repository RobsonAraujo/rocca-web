import Link from "next/link"

import { cn } from "@/lib/utils"

/**
 * TEMPORARY: lets us compare the two landing layout versions side by side.
 * Once one is chosen, delete this component, the other version's folder
 * and its route (see README > "Duas versões de layout").
 */
export const LAYOUT_VERSIONS = [
  { id: "light", label: "Light", href: "/" },
  { id: "dark", label: "Dark", href: "/dark" },
] as const

export type LayoutVersion = (typeof LAYOUT_VERSIONS)[number]["id"]

export function LayoutSwitcher({ current }: { current: LayoutVersion }) {
  return (
    <nav
      aria-label="Layout versions"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-1 rounded-full border border-border bg-popover/90 p-1 text-sm text-popover-foreground shadow-lg backdrop-blur-md">
        <span className="px-2.5 text-xs text-muted-foreground">Layout</span>
        {LAYOUT_VERSIONS.map((version) => {
          const active = version.id === current
          return (
            <Link
              key={version.id}
              href={version.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {version.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
