import { finalCta } from "@/features/landing/content"
import { WaitlistForm } from "@/features/waitlist/components/waitlist-form"

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="px-4 pb-24 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center rounded-[2rem] border border-brand/15 bg-brand/[0.06] px-4 py-14 text-center sm:px-6 sm:py-24">
        <h2
          id="final-cta-title"
          className="text-4xl leading-[1.06] font-medium tracking-[-0.04em] text-balance sm:text-6xl"
        >
          {finalCta.title}
        </h2>
        <p className="mt-4 max-w-md text-pretty text-muted-foreground">
          {finalCta.description}
        </p>
        <WaitlistForm variant="pill" className="mt-9" />
      </div>
    </section>
  )
}
