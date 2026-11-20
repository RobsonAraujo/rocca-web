import { BellIcon } from "lucide-react"
import Link from "next/link"

import { Logo } from "@/components/layout/logo"
import { cn } from "@/lib/utils"

import { shell } from "../data"
import { AskTrigger } from "./ask-panel"
import { ComingSoonButton } from "./coming-soon"
import { NavItems } from "./nav-items"

export const focusRing =
  "rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

/** Always on screen somewhere: the top bar on wide screens, else the page header. */
export function SimulatedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-brand" aria-hidden />
      {shell.badge}
    </span>
  )
}

export function Avatar({ className }: { className?: string }) {
  return (
    <span
      aria-label={shell.user.name}
      role="img"
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground",
        className,
      )}
    >
      {shell.user.initials}
    </span>
  )
}

/** Bell with an amber dot: one unread item, the suggestion waiting for you. */
export function NotificationsButton({ className }: { className?: string }) {
  return (
    <ComingSoonButton
      variant="ghost"
      size="icon"
      aria-label={shell.notifications}
      className={cn("relative size-9 rounded-lg", className)}
    >
      <BellIcon className="size-[1.125rem]" aria-hidden />
      <span
        aria-hidden
        className="absolute top-2 right-2 size-2 rounded-full bg-attention ring-2 ring-background"
      />
    </ComingSoonButton>
  )
}

/**
 * Sticky top bar for tablets and desktop (phones use the mobile app bar):
 * the Ask Rocca field on the left, status, notifications and profile on the
 * right. The page title lives in each page's header. Tablets also get the
 * nav in a row below.
 */
export function TopBar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Rocca home"
          className={cn("shrink-0 lg:hidden", focusRing)}
        >
          <Logo />
        </Link>
        <AskTrigger className="w-full max-w-sm" />
        <div className="ml-auto flex items-center gap-2">
          <SimulatedBadge className="hidden xl:inline-flex" />
          <NotificationsButton />
          {/* Desktop shows the profile at the bottom of the sidebar. */}
          <Avatar className="size-8 text-xs lg:hidden" />
        </div>
      </div>
      {/* Tablets: the nav scrolls sideways inside its own row. */}
      <nav
        aria-label="Dashboard"
        className="overflow-x-auto border-t border-border lg:hidden"
      >
        <div className="mx-auto w-full max-w-7xl px-3 py-2 sm:px-5">
          <NavItems layout="horizontal" />
        </div>
      </nav>
    </header>
  )
}
