import { BellIcon } from "lucide-react"
import Link from "next/link"

import { LogoMark } from "@/components/layout/logo"

import { ComingSoonButton } from "../components/coming-soon"
import { Avatar } from "../components/navigation"
import { CurrentPageTitle } from "../components/nav-items"
import { PREVIEW_PATH } from "../constants"
import { mobile } from "../data"

/**
 * Compact native-style top bar for phones: brand mark, centered screen
 * title, notifications and profile. Respects the status bar when the page
 * runs full screen from the home screen (viewport-fit=cover).
 */
export function MobileAppBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl md:hidden">
      <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4">
        <Link
          href="/"
          aria-label="Rocca home"
          className="justify-self-start rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <LogoMark className="size-7" />
        </Link>
        <CurrentPageTitle
          className="text-base font-semibold tracking-tight"
          labels={{ [PREVIEW_PATH]: mobile.tabs.home }}
        />
        <div className="flex items-center gap-1 justify-self-end">
          <ComingSoonButton
            variant="ghost"
            size="icon"
            aria-label={mobile.appBar.notifications}
            className="relative size-10 rounded-full"
          >
            <BellIcon className="size-5" aria-hidden />
            {/* One unread item: the suggestion waiting for your OK. */}
            <span
              aria-hidden
              className="absolute top-2 right-2 size-2 rounded-full bg-attention ring-2 ring-background"
            />
          </ComingSoonButton>
          <Avatar />
        </div>
      </div>
    </header>
  )
}
