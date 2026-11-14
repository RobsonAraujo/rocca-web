import { Badge } from "@/components/ui/badge"
import { WaitlistForm } from "@/features/waitlist/components/waitlist-form"

import { hero } from "@/features/landing/content"

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      {/* Decorative backdrop: faint grid + emerald glow. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute top-[-12rem] left-1/2 -z-10 h-[28rem] w-[56rem] max-w-none -translate-x-1/2 rounded-full bg-brand/15 blur-3xl"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
        <Badge
          variant="outline"
          className="mb-6 h-7 gap-2 px-3 text-xs text-muted-foreground motion-safe:animate-in motion-safe:fade-in"
        >
          <span className="size-1.5 rounded-full bg-brand" aria-hidden />
          {hero.eyebrow}
        </Badge>

        <h1
          id="hero-title"
          className="text-4xl font-semibold tracking-tight text-balance motion-safe:animate-in motion-safe:duration-700 motion-safe:fade-in motion-safe:slide-in-from-bottom-3 sm:text-6xl"
        >
          {hero.title}
        </h1>

        <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground motion-safe:animate-in motion-safe:duration-700 motion-safe:fade-in motion-safe:slide-in-from-bottom-3">
          {hero.description}
        </p>

        <div
          id="waitlist"
          className="mt-8 flex w-full scroll-mt-28 flex-col items-center gap-3"
        >
          <WaitlistForm />
          <p className="text-xs text-muted-foreground">{hero.note}</p>
        </div>
      </div>
    </section>
  )
}
