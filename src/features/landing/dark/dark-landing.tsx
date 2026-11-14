import { Toaster } from "@/components/ui/sonner"

import { LayoutSwitcher } from "../components/layout-switcher"
import { Faq } from "./sections/faq"
import { Features } from "./sections/features"
import { FinalCta } from "./sections/final-cta"
import { Hero } from "./sections/hero"
import { HowItWorks } from "./sections/how-it-works"
import { ProductPreview } from "./sections/product-preview"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"

/**
 * Layout version "Dark": centered hero, dashboard-style preview, card grid.
 * The `dark` class scopes the dark tokens (globals.css) to this page only.
 */
export function DarkLanding() {
  return (
    <div
      data-page-theme="dark"
      className="dark flex min-h-svh flex-col bg-background pb-16 text-foreground"
    >
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ProductPreview />
        <Features />
        <HowItWorks />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <Toaster theme="dark" position="top-center" />
      <LayoutSwitcher current="dark" />
    </div>
  )
}
