import { Toaster } from "@/components/ui/sonner"

import { LayoutSwitcher } from "../components/layout-switcher"
import { Faq } from "./sections/faq"
import { Features } from "./sections/features"
import { FinalCta } from "./sections/final-cta"
import { Hero } from "./sections/hero"
import { HowItWorks } from "./sections/how-it-works"
import { Principles } from "./sections/principles"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"

/**
 * Layout version "Light": editorial serif headings, split hero with a product
 * showcase, list-style features. Uses the default (:root) tokens.
 */
export function LightLanding() {
  return (
    <div className="flex min-h-svh flex-col bg-background pb-16 text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Principles />
        <Features />
        <HowItWorks />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <Toaster theme="light" position="top-center" />
      <LayoutSwitcher current="light" />
    </div>
  )
}
