import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

import { Logo } from "@/components/layout/logo"
import { cn } from "@/lib/utils"

import { shell } from "../data"
import { CurrentPageTitle, NavItems } from "./nav-items"

const focusRing =
  "rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

/** Always on screen somewhere: top bar from sm up, page header on phones. */
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

function Avatar() {
  return (
    <span
      aria-label={shell.user.name}
      role="img"
      className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
    >
      {shell.user.initials}
    </span>
  )
}

/** Fixed left rail on large screens. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card px-4 py-5 lg:flex">
      <Link href="/" aria-label="Rocca home" className={cn("px-2", focusRing)}>
        <Logo />
      </Link>
      <nav aria-label="Dashboard" className="mt-8 flex-1">
        <NavItems layout="vertical" />
      </nav>
      <Link
        href="/"
        className={cn(
          "flex h-9 items-center gap-2 px-3 text-sm text-muted-foreground transition-colors hover:text-foreground",
          focusRing,
        )}
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        {shell.backToSite}
      </Link>
    </aside>
  )
}

/** Sticky top bar: full nav on phones/tablets, page title on desktop. */
export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Rocca home"
          className={cn("lg:hidden", focusRing)}
        >
          <Logo />
        </Link>
        <CurrentPageTitle />
        <div className="flex items-center gap-3">
          <SimulatedBadge className="hidden sm:inline-flex" />
          <Avatar />
        </div>
      </div>
      {/* Phones and tablets: the nav scrolls sideways inside its own row. */}
      <nav
        aria-label="Dashboard"
        className="overflow-x-auto border-t border-border/70 lg:hidden"
      >
        <div className="mx-auto w-full max-w-7xl px-3 py-2 sm:px-5">
          <NavItems layout="horizontal" />
        </div>
      </nav>
    </header>
  )
}
