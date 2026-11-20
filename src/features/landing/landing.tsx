import { Toaster } from "@/components/ui/sonner"

import { Faq } from "./sections/faq"
import { Features } from "./sections/features"
import { FinalCta } from "./sections/final-cta"
import { Hero } from "./sections/hero"
import { HowItWorks } from "./sections/how-it-works"
import { LiveNews } from "./sections/live-news"
import { Principles } from "./sections/principles"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"

/**
 * The landing page: split hero with a product showcase, the news card, bento
 * features, timeline steps. Uses the default (:root) tokens from globals.css.
 *
 * `news` is a slot for the live news card: the page passes it, so the
 * landing never fetches anything itself.
 */
export function Landing({ news }: { news?: React.ReactNode } = {}) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground selection:bg-brand/15">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Principles />
        {news && <LiveNews>{news}</LiveNews>}
        <Features />
        <HowItWorks />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <Toaster theme="light" position="top-center" />
    </div>
  )
}
