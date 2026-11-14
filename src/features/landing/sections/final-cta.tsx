import { LogoMark } from "@/components/layout/logo"
import { finalCta, hero } from "@/features/landing/content"
import { WaitlistForm } from "@/features/waitlist/components/waitlist-form"

import { Container } from "../primitives"

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="pb-20 sm:pb-28">
      <Container>
        <div className="flex flex-col items-center rounded-3xl border border-brand/15 bg-brand/[0.05] px-4 py-14 text-center sm:px-10 sm:py-20">
          <LogoMark className="size-10" />
          <h2
            id="final-cta-title"
            className="mt-6 text-4xl leading-[1.06] font-semibold tracking-[-0.04em] text-balance sm:text-5xl"
          >
            {finalCta.title}
          </h2>
          <p className="mt-4 max-w-lg text-lg text-pretty text-muted-foreground">
            {finalCta.description}
          </p>
          <WaitlistForm variant="pill" className="mt-9" />
          <p className="mt-3 text-xs text-muted-foreground">{hero.note}</p>
        </div>
      </Container>
    </section>
  )
}
