import { hero } from "@/features/landing/content"
import { WaitlistForm } from "@/features/waitlist/components/waitlist-form"

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
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute top-24 right-[-10rem] -z-10 hidden size-[36rem] rounded-full bg-brand/10 blur-3xl lg:block"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 pt-12 pb-20 sm:px-6 sm:pb-28 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div className="motion-safe:animate-in motion-safe:duration-700 motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden />
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

          <div id="waitlist" className="mt-9 scroll-mt-28 space-y-3">
            <WaitlistForm variant="pill" />
            <p className="px-4 text-xs text-muted-foreground">{hero.note}</p>
          </div>
        </div>

        <ProductShowcase />
      </div>
    </section>
  )
}
