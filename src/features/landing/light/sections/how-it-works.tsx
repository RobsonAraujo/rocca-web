import { howItWorks } from "@/features/landing/content"

import { SectionIntro } from "../section-intro"

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="scroll-mt-20 bg-secondary/70 px-4 py-24 sm:px-6 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          id="how-it-works-title"
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.title}
        />

        <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {howItWorks.steps.map((step, index) => (
            <li key={step.title} className="border-t border-foreground/15 pt-6">
              <span className="font-serif text-5xl text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
