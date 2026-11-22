import Link from "next/link"

import { Logo } from "@/components/layout/logo"
import { buttonVariants } from "@/components/ui/button"
import { demoCta, navLinks } from "@/features/landing/content"
import { DEMO_PATH } from "@/features/preview/constants"
import { cn } from "@/lib/utils"

import { Container, focusRing, navLinkClass } from "./primitives"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <a href="#top" aria-label="Rocca home" className={focusRing}>
          <Logo />
        </a>

        <div className="flex items-center gap-8">
          <nav
            aria-label="Main"
            className="hidden items-center gap-7 text-sm md:flex"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {/* Phones don't fit both; the hero shows the demo link right there. */}
            <Link
              href={DEMO_PATH}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hidden h-9 rounded-full px-4 sm:inline-flex",
              )}
            >
              {demoCta.label}
            </Link>
            <a
              href="#waitlist"
              className={cn(buttonVariants(), "h-9 rounded-full px-4")}
            >
              Join the waitlist
            </a>
          </div>
        </div>
      </Container>
    </header>
  )
}
