import { CurrentYear } from "@/components/layout/current-year"
import { Logo } from "@/components/layout/logo"
import { siteConfig } from "@/config/site"
import { footer, navLinks } from "@/features/landing/content"

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-border">
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-sm text-muted-foreground">
              {footer.tagline}
            </span>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-7 gap-y-2 text-sm"
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

        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {footer.disclaimer}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          © <CurrentYear /> {siteConfig.name}. All rights reserved.
        </p>

        {/* Oversized wordmark as a quiet sign-off. */}
        <p
          aria-hidden
          className="mt-10 -mb-[0.22em] text-center font-serif text-[22vw] leading-none tracking-tight text-foreground/[0.05] select-none lg:text-[15rem]"
        >
          {siteConfig.name}
        </p>
      </div>
    </footer>
  )
}
