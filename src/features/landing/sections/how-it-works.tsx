import { howItWorks } from "@/features/landing/content"
import { cn } from "@/lib/utils"

import { Section } from "../primitives"
import { SectionIntro } from "../section-intro"

/**
 * Connected timeline: vertical on phones, horizontal from md up. Step 1 is
 * filled to mark where the visitor is right now: about to join the waitlist.
 */
export function HowItWorks() {
  const { steps } = howItWorks

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

      <ol className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-6">
        {steps.map((step, index) => {
          const isFirst = index === 0
          const isLast = index === steps.length - 1
          return (
            <li key={step.title} className="relative flex gap-5 md:flex-col">
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute top-12 -bottom-6 left-5 w-px bg-border md:top-5 md:-right-4 md:bottom-auto md:left-14 md:h-px md:w-auto"
                />
              )}
              {/* The <ol> already announces the order; the number is visual. */}
              <span
                aria-hidden
                className={cn(
                  "relative grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums",
                  isFirst
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card shadow-soft",
                )}
              >
                {index + 1}
              </span>
              <div className="pt-1.5 md:pt-0">
                <h3 className="text-lg leading-7 font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
