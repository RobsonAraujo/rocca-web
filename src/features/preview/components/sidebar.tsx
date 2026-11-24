"use client"

import {
  ArrowLeftIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Logo } from "@/components/layout/logo"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { shell } from "../data"
import { Avatar, useSignedInUser } from "./greeting"
import { NavItems, RailTooltip } from "./nav-items"
import { focusRing } from "./navigation"

/**
 * Fixed left rail on large screens. The icon at the top collapses it to
 * icons (w-18) and back; collapsed, that icon is all the top row shows.
 *
 * The page column follows it through `data-state` with Tailwind's peer
 * variant, so the column must be the next sibling of this aside and match
 * both widths (see shell.tsx). The choice lives here, in the preview layout:
 * it survives moving between preview pages, and a reload starts expanded,
 * like the rest of the demo.
 *
 * Widths keep every icon in place while the rail animates: 16px rail padding
 * plus 12px item padding on each side of a 16px icon is 72px (w-18). The
 * toggle sits at the row's end (ml-auto), so it rides the edge as it moves.
 */
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const user = useSignedInUser()
  const toggleLabel = collapsed ? shell.expandMenu : shell.collapseMenu
  const ToggleIcon = collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon

  return (
    <aside
      data-state={collapsed ? "collapsed" : "expanded"}
      className={cn(
        "peer/sidebar fixed inset-y-0 left-0 z-30 hidden flex-col overflow-x-hidden border-r border-border bg-card px-4 py-5 transition-[width] duration-200 ease-out motion-reduce:transition-none lg:flex",
        collapsed ? "w-18" : "w-64",
      )}
    >
      <TooltipProvider>
        <div className="flex h-9 items-center">
          {!collapsed && (
            <Link
              href="/"
              aria-label="Rocca home"
              className={cn("flex h-7 items-center px-1.5", focusRing)}
            >
              <Logo />
            </Link>
          )}
          {/* Icon only in both states, so its tooltip is always on. */}
          <RailTooltip label={toggleLabel} enabled>
            <button
              type="button"
              aria-label={toggleLabel}
              onClick={() => setCollapsed((value) => !value)}
              className="ml-auto grid h-9 w-10 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ToggleIcon className="size-4" aria-hidden />
            </button>
          </RailTooltip>
        </div>
        <nav aria-label="Dashboard" className="mt-6 flex-1">
          <NavItems layout="vertical" collapsed={collapsed} />
        </nav>
        {/* Who is signed in: avatar alone when collapsed (it keeps its name). */}
        <div className="mb-2 flex items-center gap-2.5 border-t border-border px-1 pt-4">
          <Avatar className="size-8 text-xs" />
          <div className={cn("min-w-0 leading-tight", collapsed && "sr-only")}>
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.plan}
            </p>
          </div>
        </div>
        <RailTooltip label={shell.backToSite} enabled={collapsed}>
          <Link
            href="/"
            className={cn(
              "flex h-9 items-center gap-2.5 px-3 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
              focusRing,
            )}
          >
            <ArrowLeftIcon className="size-4 shrink-0" aria-hidden />
            <span className={cn(collapsed && "sr-only")}>
              {shell.backToSite}
            </span>
          </Link>
        </RailTooltip>
      </TooltipProvider>
    </aside>
  )
}
