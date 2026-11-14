"use client"

import type { LucideIcon } from "lucide-react"
import {
  ChartPieIcon,
  GraduationCapIcon,
  HouseIcon,
  MenuIcon,
  SparklesIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { PORTFOLIO_PATH, PREVIEW_PATH } from "../constants"
import { mobile } from "../data"
import { SheetTrigger, askSheet, menuSheet } from "./sheet"

type Tab = { label: string; icon: LucideIcon; href?: string }

const left: Tab[] = [
  { label: mobile.tabs.home, icon: HouseIcon, href: PREVIEW_PATH },
  { label: mobile.tabs.portfolio, icon: ChartPieIcon, href: PORTFOLIO_PATH },
]
const right: Tab[] = [{ label: mobile.tabs.learn, icon: GraduationCapIcon }]

const itemClass =
  "flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-medium outline-none select-none focus-visible:bg-secondary active:scale-95 transition-transform"

function TabItem({ tab, pathname }: { tab: Tab; pathname: string }) {
  const { label, icon: Icon, href } = tab
  const current = href === pathname
  const content = (
    <>
      <Icon
        className="size-[1.375rem]"
        strokeWidth={current ? 2.25 : 1.75}
        aria-hidden
      />
      {label}
    </>
  )
  return (
    <li className="h-full">
      {href ? (
        <Link
          href={href}
          aria-current={current ? "page" : undefined}
          className={cn(
            itemClass,
            current ? "text-brand" : "text-muted-foreground",
          )}
        >
          {content}
        </Link>
      ) : (
        <ComingSoonButton
          variant="ghost"
          className={cn(
            itemClass,
            "h-full rounded-none p-0 text-muted-foreground hover:bg-transparent",
          )}
        >
          {content}
        </ComingSoonButton>
      )}
    </li>
  )
}

/**
 * Native-style bottom tab bar for phones. Built pages are links; the rest
 * show the coming-soon notice. The raised center button opens the Ask sheet.
 */
export function MobileTabBar() {
  const pathname = usePathname()
  return (
    <nav
      aria-label={mobile.tabs.label}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-5">
        {left.map((tab) => (
          <TabItem key={tab.label} tab={tab} pathname={pathname} />
        ))}
        <li className="flex h-full items-start justify-center">
          <SheetTrigger
            handle={askSheet}
            className="-mt-5 flex flex-col items-center gap-1 text-[11px] font-medium text-foreground select-none"
          >
            <span className="grid size-14 place-items-center rounded-full bg-brand text-brand-foreground shadow-float ring-4 ring-card transition-transform active:scale-95">
              <SparklesIcon className="size-6" aria-hidden />
            </span>
            {mobile.tabs.ask}
          </SheetTrigger>
        </li>
        {right.map((tab) => (
          <TabItem key={tab.label} tab={tab} pathname={pathname} />
        ))}
        {/* Everything from the desktop sidebar, in a sheet. */}
        <li className="h-full">
          <SheetTrigger
            handle={menuSheet}
            className={cn(itemClass, "text-muted-foreground")}
          >
            <MenuIcon
              className="size-[1.375rem]"
              strokeWidth={1.75}
              aria-hidden
            />
            {mobile.tabs.more}
          </SheetTrigger>
        </li>
      </ul>
    </nav>
  )
}
