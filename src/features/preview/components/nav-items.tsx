"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { shell } from "../data"
import { ComingSoonButton } from "./coming-soon"

/**
 * Names an icon-only item of the collapsed sidebar on hover and focus.
 * `children` is the item itself (a link or button). It stays mounted while
 * expanded (just disabled), so toggling the sidebar doesn't remount the
 * items and keeps focus where it was.
 */
export function RailTooltip({
  label,
  enabled,
  children,
}: {
  label: string
  enabled: boolean
  children: React.ReactElement
}) {
  return (
    <Tooltip disabled={!enabled}>
      <TooltipTrigger render={children} />
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Dashboard nav. Built pages are real links (the current one is marked with
 * aria-current); the rest aren't built yet, so they show the coming-soon
 * notice. usePathname needs no Suspense here: every preview route is static.
 *
 * `collapsed` (vertical only) shows icons alone: labels stay for screen
 * readers and come back as tooltips.
 */
export function NavItems({
  layout,
  collapsed = false,
}: {
  layout: "vertical" | "horizontal"
  collapsed?: boolean
}) {
  const pathname = usePathname()
  const vertical = layout === "vertical"
  const itemClass = cn(
    "flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
    vertical && "w-full justify-start",
  )

  return (
    <ul className={cn("flex gap-1", vertical ? "flex-col" : "flex-row")}>
      {shell.nav.map(({ label, icon: Icon, href }) => {
        const current = href === pathname
        const content = (
          <>
            <Icon
              className={cn("size-4", current && "text-brand")}
              aria-hidden
            />
            <span className={cn(collapsed && "sr-only")}>{label}</span>
          </>
        )
        const item = href ? (
          <Link
            href={href}
            aria-current={current ? "page" : undefined}
            className={cn(
              itemClass,
              "transition-colors",
              current
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {content}
          </Link>
        ) : (
          <ComingSoonButton
            variant="ghost"
            className={cn(itemClass, "text-muted-foreground")}
          >
            {content}
          </ComingSoonButton>
        )
        return (
          <li key={label} className="shrink-0">
            {vertical ? (
              <RailTooltip label={label} enabled={collapsed}>
                {item}
              </RailTooltip>
            ) : (
              item
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** Name of the current page (desktop top bar, mobile app bar). */
export function CurrentPageTitle({
  className = "hidden text-sm font-medium lg:block",
  labels,
}: {
  className?: string
  /** Per-path overrides, e.g. "Home" on phones where the tab says Home. */
  labels?: Record<string, string>
}) {
  const pathname = usePathname()
  const page = shell.nav.find((item) => item.href === pathname)
  return <p className={className}>{labels?.[pathname] ?? page?.label ?? ""}</p>
}
