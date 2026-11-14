import { features } from "@/features/landing/content"

import { Section } from "../primitives"
import { SectionIntro } from "../section-intro"

export function Features() {
  return (
    <Section id="features" aria-labelledby="features-title">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <SectionIntro
          id="features-title"
          eyebrow={features.eyebrow}
          title={features.title}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <ul className="divide-y divide-border border-y border-border">
          {features.items.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-5 py-7 sm:py-8">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                <Icon className="size-5" aria-hidden />
              </span>
              {/* pt-1.5 centers the title's first line on the icon. */}
              <div className="pt-1.5">
                <h3 className="text-lg leading-7 font-medium tracking-tight">
                  {title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
