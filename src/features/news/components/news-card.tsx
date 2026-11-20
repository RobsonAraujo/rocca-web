import { cn } from "@/lib/utils"

import type { NewsAudience } from "../content"
import { newsCopy } from "../content"
import type { PortfolioNews } from "../get-portfolio-news"
import { HiddenOpinion } from "./hidden-opinion"
import type { NewsLayout } from "./news-list"
import { NewsFeed } from "./news-list"

/** At most this many hidden opinion pieces are sent to the browser. */
const HIDDEN_SHOWN = 5

type CardProps = {
  id: string
  className?: string
  /** `public` (the landing) never mentions "your portfolio"; see NewsAudience. */
  audience?: NewsAudience
  /** `compact` drops the lead photo, for the dashboard; see NewsFeed. */
  layout?: NewsLayout
}

/** Same surface as the dashboard's other widgets; editorial inside. */
const surface =
  "scroll-mt-24 rounded-2xl bg-card p-5 text-card-foreground shadow-soft ring-1 ring-foreground/10 sm:p-7"

/** Title on the left, a quiet status on the right, a hairline below. */
function Header({
  id,
  title,
  status,
}: {
  id: string
  title: string
  status?: React.ReactNode
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
      <h2
        id={`${id}-title`}
        className="text-base font-semibold tracking-tight sm:text-lg"
      >
        {title}
      </h2>
      {status}
    </header>
  )
}

/** "● LIVE" in the brand color, or a muted "Sample headlines". */
function Status({ live }: { live: boolean }) {
  return live ? (
    <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand uppercase">
      <span className="size-1.5 rounded-full bg-brand" aria-hidden />
      {newsCopy.live}
    </p>
  ) : (
    <p className="text-xs text-muted-foreground">{newsCopy.simulated}</p>
  )
}

/** The news card, given already-fetched news. */
export function NewsCard({
  id,
  className,
  audience = "portfolio",
  layout = "editorial",
  news,
}: CardProps & { news: PortfolioNews }) {
  const copy = newsCopy.byAudience[audience]
  const attribution = news.live
    ? `${newsCopy.attribution} ${news.provider}. ${copy.liveNote}`.trim()
    : copy.simulatedNote

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(surface, className)}
    >
      <Header id={id} title={copy.title} status={<Status live={news.live} />} />

      <div className={layout === "compact" ? "py-5" : "py-6"}>
        {news.items.length > 0 ? (
          <NewsFeed items={news.items} audience={audience} layout={layout} />
        ) : (
          <p className="text-sm text-muted-foreground">{copy.empty}</p>
        )}
      </div>

      <footer className="border-t border-border pt-4">
        <HiddenOpinion
          items={news.hiddenOpinion.slice(0, HIDDEN_SHOWN)}
          count={news.hiddenOpinion.length}
          audience={audience}
          trailing={<p>{attribution}</p>}
        />
      </footer>
    </section>
  )
}

/** Suspense fallback in the card's shape, so the layout doesn't jump. */
export function NewsSkeleton({
  id,
  className,
  audience = "portfolio",
  layout = "editorial",
}: CardProps) {
  const copy = newsCopy.byAudience[audience]
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      aria-busy
      className={cn(surface, className)}
    >
      <Header id={id} title={copy.title} />
      <p className="sr-only">{newsCopy.loading}</p>
      {layout === "compact" ? (
        <div
          aria-hidden
          className="grid animate-pulse gap-x-8 gap-y-6 py-5 md:grid-cols-2"
        >
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-20 rounded bg-secondary" />
                <div className="h-4 w-full rounded bg-secondary" />
                <div className="h-3 w-32 rounded bg-secondary" />
              </div>
              <div className="aspect-[3/2] w-24 shrink-0 rounded-sm bg-secondary sm:w-28" />
            </div>
          ))}
        </div>
      ) : (
        <div
          aria-hidden
          className="grid animate-pulse gap-6 py-6 lg:grid-cols-12 lg:gap-0"
        >
          <div className="space-y-3 lg:col-span-7 lg:pr-8">
            <div className="aspect-[16/9] w-full rounded-md bg-secondary" />
            <div className="h-2.5 w-24 rounded bg-secondary" />
            <div className="h-6 w-full rounded bg-secondary" />
            <div className="h-6 w-2/3 rounded bg-secondary" />
          </div>
          <div className="space-y-6 lg:col-span-5 lg:border-l lg:border-border lg:pl-8">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-20 rounded bg-secondary" />
                  <div className="h-4 w-full rounded bg-secondary" />
                  <div className="h-3 w-32 rounded bg-secondary" />
                </div>
                <div className="aspect-[3/2] w-24 shrink-0 rounded-sm bg-secondary sm:w-28" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
