import { CurrentYear } from "@/components/layout/current-year"
import { Logo } from "@/components/layout/logo"
import { siteConfig } from "@/config/site"
import { footer, navLinks } from "@/features/landing/content"

import { Container, navLinkClass } from "./primitives"

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-border">
      <Container className="pt-12 sm:pt-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Logo />
            <p className="text-sm text-muted-foreground">{footer.tagline}</p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-7 gap-y-2 text-sm sm:pt-1"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6 sm:mt-12">
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
            {footer.disclaimer}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
        </div>

        {/* Oversized wordmark as a quiet sign-off. */}
        <p
          aria-hidden
          className="mt-10 -mb-[0.2em] text-center text-[21vw] leading-none font-semibold tracking-[-0.06em] text-foreground/[0.05] select-none lg:text-[13rem]"
        >
          {siteConfig.name}
        </p>
      </Container>
    </footer>
  )
}
