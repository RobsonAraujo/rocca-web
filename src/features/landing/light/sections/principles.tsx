import { principles } from "@/features/landing/content"

export function Principles() {
  return (
    <section
      aria-label="Our principles"
      className="border-y border-border bg-card"
    >
      <ul className="mx-auto grid max-w-6xl divide-y divide-border px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
        {principles.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-3 py-5 text-sm sm:justify-center sm:px-6"
          >
            <Icon className="size-4 shrink-0 text-brand" aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </section>
  )
}
