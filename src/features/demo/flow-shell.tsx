import Link from "next/link"

import { Logo } from "@/components/layout/logo"
import { footer } from "@/features/landing/content"
import {
  SimulatedBadge,
  focusRing,
} from "@/features/preview/components/navigation"
import { cn } from "@/lib/utils"

import { flow } from "./content"
import { StepProgress } from "./step-progress"

/**
 * Chrome of the recordable demo's steps (sign in, about you, connect, first
 * look): the logo, where you are, a "Demo · simulated data" chip that never
 * leaves the screen, and the legal disclaimer under every step.
 */
export function DemoFlowShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-canvas text-foreground selection:bg-brand/15">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4 sm:px-6">
          <Link
            href="/"
            aria-label={flow.home}
            className={cn("shrink-0", focusRing)}
          >
            <Logo />
          </Link>
          <StepProgress className="mx-auto hidden sm:flex" />
          <div className="ml-auto flex items-center gap-3 sm:ml-0">
            <SimulatedBadge label={flow.badge} />
            <Link
              href="/"
              className={cn(
                "text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground max-sm:hidden",
                focusRing,
              )}
            >
              {flow.exit}
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6">
        <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {footer.disclaimer}
        </p>
      </footer>
    </div>
  )
}
