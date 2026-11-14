import { howItWorks } from "../content"
import { SectionHeading } from "../components/section-heading"

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="scroll-mt-20 border-y border-border/60 bg-card/30 px-4 py-24 sm:px-6"
    >
      <SectionHeading
        id="how-it-works-title"
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
      />

      <ol className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-3">
        {howItWorks.steps.map((step, index) => (
          <li key={step.title} className="space-y-3">
            <span className="grid size-9 place-items-center rounded-full border border-brand/40 font-mono text-sm text-brand">
              {index + 1}
            </span>
            <h3 className="font-semibold">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
