import { LockIcon } from "lucide-react"

import { hero } from "@/features/landing/content"
import { PREVIEW_PATH } from "@/features/preview/constants"
import { WaitlistForm } from "@/features/waitlist/components/waitlist-form"

import { Container } from "../primitives"
import { ProductShowcase } from "./product-showcase"

/** Renders the title with `hero.emphasis` highlighted in the brand color. */
function HeroTitle() {
  const index = hero.title.indexOf(hero.emphasis)
  if (index === -1) return <>{hero.title}</>

  return (
    <>
      {hero.title.slice(0, index)}
      <span data-slot="hero-emphasis" className="text-brand">
        {hero.emphasis}
      </span>
      {hero.title.slice(index + hero.emphasis.length)}
    </>
  )
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="overflow-hidden">
      <Container className="grid items-center gap-14 pt-14 pb-16 sm:pb-28 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-32">
        <div className="motion-safe:animate-in motion-safe:duration-700 motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
          <p className="inline-flex h-7 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs font-medium text-muted-foreground shadow-soft">
            <span
              className="size-1.5 rounded-full bg-brand ring-4 ring-brand/15"
              aria-hidden
            />
            {hero.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-5xl leading-[1.04] font-medium tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl"
          >
            <HeroTitle />
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground">
            {hero.description}
          </p>

          <div id="waitlist" className="mt-10 max-w-md scroll-mt-28 space-y-3">
            <WaitlistForm variant="pill" successHref={PREVIEW_PATH} />
            <p className="flex items-center gap-1.5 px-4 text-xs text-muted-foreground">
              <LockIcon className="size-3.5 shrink-0" aria-hidden />
              {hero.note}
            </p>
          </div>
        </div>

        <ProductShowcase />
      </Container>
    </section>
  )
}
