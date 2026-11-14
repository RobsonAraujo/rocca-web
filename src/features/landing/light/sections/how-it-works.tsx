import { howItWorks } from "@/features/landing/content"

import { Section } from "../primitives"
import { SectionIntro } from "../section-intro"

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      tone="muted"
    >
      <SectionIntro
        id="how-it-works-title"
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
      />

      <ol className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-3 md:gap-5">
        {howItWorks.steps.map((step, index) => (
          // Number beside the text on phones (compact), above it from md up.
          <li
            key={step.title}
            className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6 md:flex-col md:gap-5 lg:p-7"
          >
            {/* The <ol> already announces the order; the number is visual. */}
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-sm font-semibold text-brand tabular-nums"
            >
              {index + 1}
            </span>
            <div className="pt-1 md:pt-0">
              <h3 className="text-lg leading-7 font-medium tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
