import { ArrowRightIcon } from "lucide-react"

import { liveNews } from "@/features/landing/content"
import { cn } from "@/lib/utils"

import { Section, focusRing } from "../primitives"
import { SectionIntro } from "../section-intro"

/**
 * Headlines for the sample portfolio, right under the hero: proof that the
 * product reads real news. The card comes in as `children` from the page,
 * so the landing itself never fetches anything.
 */
export function LiveNews({ children }: { children: React.ReactNode }) {
  return (
    <Section id="live-news" aria-labelledby="live-news-title" tone="muted">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
        <SectionIntro
          id="live-news-title"
          eyebrow={liveNews.eyebrow}
          title={liveNews.title}
        />
        <p className="max-w-sm leading-relaxed text-pretty text-muted-foreground">
          {liveNews.description}
        </p>
      </div>

      <div className="mt-10 md:mt-12">{children}</div>

      <a
        href="#waitlist"
        className={cn(
          "mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline",
          focusRing,
        )}
      >
        {liveNews.cta}
        <ArrowRightIcon className="size-4" aria-hidden />
      </a>
    </Section>
  )
}
