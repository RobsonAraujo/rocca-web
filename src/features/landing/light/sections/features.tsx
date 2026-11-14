import { features } from "@/features/landing/content"

import { SectionIntro } from "../section-intro"

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-20 px-4 py-24 sm:px-6 lg:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <SectionIntro
          id="features-title"
          eyebrow={features.eyebrow}
          title={features.title}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <ul className="divide-y divide-border border-y border-border">
          {features.items.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-5 py-8">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card text-brand">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
