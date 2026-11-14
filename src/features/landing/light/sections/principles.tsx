import { principles } from "@/features/landing/content"

import { Container } from "../primitives"

/** Trust bar right under the hero: the three promises that lower the risk of signing up. */
export function Principles() {
  return (
    <section
      aria-label="Our principles"
      className="border-y border-border bg-card"
    >
      <Container>
        <ul className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {principles.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 py-4 text-sm font-medium md:px-6 md:py-6 md:first:pl-0 md:last:pr-0 lg:px-8"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                <Icon className="size-4" aria-hidden />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
