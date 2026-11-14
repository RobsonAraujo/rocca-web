import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { Faq } from "@/features/landing/sections/faq"
import { Features } from "@/features/landing/sections/features"
import { FinalCta } from "@/features/landing/sections/final-cta"
import { Hero } from "@/features/landing/sections/hero"
import { HowItWorks } from "@/features/landing/sections/how-it-works"
import { ProductPreview } from "@/features/landing/sections/product-preview"

export default function HomePage() {
  return (
    <>
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
    </>
  )
}
