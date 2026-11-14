import { features } from "../content"
import { SectionHeading } from "../components/section-heading"

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <SectionHeading
        id="features-title"
        eyebrow={features.eyebrow}
        title={features.title}
      />

      <ul className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2">
        {features.items.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-brand/30"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-5 font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
