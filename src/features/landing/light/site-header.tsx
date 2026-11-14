import { Logo } from "@/components/layout/logo"
import { buttonVariants } from "@/components/ui/button"
import { navLinks } from "@/features/landing/content"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <a href="#top" aria-label="Rocca home">
          <Logo />
        </a>

        <div className="flex items-center gap-8">
          <nav
            aria-label="Main"
            className="hidden items-center gap-7 text-sm md:flex"
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
          <a
            href="#waitlist"
            className={cn(buttonVariants(), "h-9 rounded-full px-4")}
          >
            Join the waitlist
          </a>
        </div>
      </div>
    </header>
  )
}
