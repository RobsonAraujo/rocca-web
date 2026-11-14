import { footer, navLinks } from "@/features/landing/content"
import { siteConfig } from "@/config/site"

import { Logo } from "./logo"

/**
 * With Cache Components, reading the clock during render must be explicit.
 * "use cache" bakes the year into the static shell and refreshes it on revalidation.
 */
async function CurrentYear() {
  "use cache"
  return <>{new Date().getFullYear()}</>
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Logo />
            <p className="text-sm text-muted-foreground">{footer.tagline}</p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
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
        </div>

        <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {footer.disclaimer}
        </p>
        <p className="text-xs text-muted-foreground">
          © <CurrentYear /> {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
