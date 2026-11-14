"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { shell } from "../data"
import { ComingSoonButton } from "./coming-soon"

/**
 * Dashboard nav. Built pages are real links (the current one is marked with
 * aria-current); the rest aren't built yet, so they show the coming-soon
 * notice. usePathname needs no Suspense here: every preview route is static.
 */
export function NavItems({ layout }: { layout: "vertical" | "horizontal" }) {
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
        return (
          <li key={label} className="shrink-0">
            {href ? (
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
                <Icon
                  className={cn("size-4", current && "text-brand")}
                  aria-hidden
                />
                {label}
              </Link>
            ) : (
              <ComingSoonButton
                variant="ghost"
                className={cn(itemClass, "text-muted-foreground")}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </ComingSoonButton>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** Name of the current page for the desktop top bar. */
export function CurrentPageTitle() {
  const pathname = usePathname()
  const page = shell.nav.find((item) => item.href === pathname)
  return (
    <p className="hidden text-sm font-medium lg:block">{page?.label ?? ""}</p>
  )
}
