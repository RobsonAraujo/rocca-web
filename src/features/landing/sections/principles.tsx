import { principles } from "@/features/landing/content"

import { Container } from "../primitives"

/** Trust row right under the hero: the three promises that lower the risk of signing up. */
export function Principles() {
  return (
    <section aria-label="Our principles">
      <Container>
        <ul className="grid gap-4 border-y border-border py-7 md:grid-cols-3 md:gap-8">
          {principles.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 text-sm font-medium"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
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
