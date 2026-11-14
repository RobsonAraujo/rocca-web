import { buttonVariants } from "@/components/ui/button"
import { navLinks } from "@/features/landing/content"

import { Logo } from "./logo"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <a href="#top" aria-label="Rocca home">
          <Logo />
        </a>

        <nav
          aria-label="Main"
          className="hidden items-center gap-6 text-sm md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#waitlist" className={buttonVariants({ size: "lg" })}>
          Join the waitlist
        </a>
      </div>
    </header>
  )
}
