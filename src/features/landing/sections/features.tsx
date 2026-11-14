import type { FeatureId } from "@/features/landing/content"
import { features } from "@/features/landing/content"
import { cn } from "@/lib/utils"

import { Section } from "../primitives"
import { SectionIntro } from "../section-intro"
import {
  AccountsVisual,
  AlertsVisual,
  ApprovalVisual,
  MovesVisual,
} from "./feature-visuals"

/** Bento layout: wide/narrow cards alternate on large screens (12-col grid). */
const bento: Record<
  FeatureId,
  { span: string; Visual: () => React.ReactNode }
> = {
  accounts: { span: "lg:col-span-7", Visual: AccountsVisual },
  moves: { span: "lg:col-span-5", Visual: MovesVisual },
  approval: { span: "lg:col-span-5", Visual: ApprovalVisual },
  alerts: { span: "lg:col-span-7", Visual: AlertsVisual },
}

export function Features() {
  return (
    <Section id="features" aria-labelledby="features-title">
      <SectionIntro
        id="features-title"
        eyebrow={features.eyebrow}
        title={features.title}
      />

      <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-14 lg:grid-cols-12">
        {features.items.map(({ id, icon: Icon, title, description }) => {
          const { span, Visual } = bento[id]
          return (
            <li
              key={id}
              className={cn(
                "flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft",
                span,
              )}
            >
              <div
                aria-hidden
                className="flex h-52 items-center justify-center border-b border-border/70 bg-secondary/60 p-5 sm:h-56 sm:p-6"
              >
                <Visual />
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  <Icon className="size-4.5 shrink-0 text-brand" aria-hidden />
                  {title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
