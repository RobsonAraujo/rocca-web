"use client"

import { Drawer } from "@base-ui/react/drawer"
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { SoonBadge } from "../components/nav-items"
import { mobile, shell } from "../data"
import { SheetFrame, menuSheet } from "./sheet"

const rowClass =
  "flex min-h-14 w-full items-center gap-3 px-4 text-left text-[15px] font-medium outline-none transition-colors active:bg-secondary"

/**
 * The desktop sidebar, as a phone sheet (opened by the "More" tab). Built
 * pages are real links that close the sheet as they navigate (a Close
 * rendered as a link would lose link semantics); the rest show coming soon.
 */
export function MenuSheet() {
  const pathname = usePathname()
  return (
    <Drawer.Root handle={menuSheet}>
      <SheetFrame title={mobile.menu.title}>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
          {shell.nav.map(({ label, icon: Icon, href }) => {
            const current = href === pathname
            const content = (
              <>
                <Icon
                  className={cn(
                    "size-5",
                    current ? "text-brand" : "text-muted-foreground",
                  )}
                  aria-hidden
                />
                <span className="flex-1">{label}</span>
                {!href && <SoonBadge />}
                <ChevronRightIcon
                  className="size-4 text-muted-foreground"
                  aria-hidden
                />
              </>
            )
            return (
              <li key={label}>
                {href ? (
                  <Link
                    href={href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => menuSheet.close()}
                    className={cn(rowClass, current && "text-brand")}
                  >
                    {content}
                  </Link>
                ) : (
                  <ComingSoonButton
                    variant="ghost"
                    className={cn(
                      rowClass,
                      "h-auto rounded-none hover:bg-transparent",
                    )}
                  >
                    {content}
                  </ComingSoonButton>
                )}
              </li>
            )
          })}
        </ul>
        <Link
          href="/"
          onClick={() => menuSheet.close()}
          className="mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl text-sm text-muted-foreground outline-none active:bg-secondary"
        >
          <ArrowLeftIcon className="size-4" aria-hidden />
          {mobile.menu.backToSite}
        </Link>
      </SheetFrame>
    </Drawer.Root>
  )
}
