import { WaitlistForm } from "@/features/waitlist/components/waitlist-form"

import { finalCta } from "@/features/landing/content"

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="px-4 pb-24 sm:px-6">
      <div className="relative isolate mx-auto flex max-w-4xl flex-col items-center overflow-hidden rounded-3xl border border-border bg-card/50 px-6 py-16 text-center">
        <div
          aria-hidden
          className="absolute bottom-[-10rem] left-1/2 -z-10 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl"
        />
        <h2
          id="final-cta-title"
          className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
        >
          {finalCta.title}
        </h2>
        <p className="mt-3 max-w-md text-pretty text-muted-foreground">
          {finalCta.description}
        </p>
        <WaitlistForm className="mt-8" />
      </div>
    </section>
  )
}
