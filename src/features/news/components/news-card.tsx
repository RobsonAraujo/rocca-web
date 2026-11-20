import { NewspaperIcon } from "lucide-react"

import { Panel } from "@/features/preview/components/panel"
import { cn } from "@/lib/utils"

import { newsCopy } from "../content"
import type { PortfolioNews } from "../get-portfolio-news"
import { HiddenOpinion } from "./hidden-opinion"
import { NewsFeed } from "./news-list"

/** At most this many hidden opinion pieces are sent to the browser. */
const HIDDEN_SHOWN = 5

type CardProps = { id: string; className?: string }

function SourceBadge({ news }: { news: PortfolioNews }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        news.live
          ? "bg-brand/10 text-brand"
          : "bg-secondary text-muted-foreground",
      )}
    >
      {news.live && (
        <span className="size-1.5 rounded-full bg-brand" aria-hidden />
      )}
      {news.live ? `${newsCopy.live} · ${news.provider}` : newsCopy.simulated}
    </span>
  )
}

/** The news card, given already-fetched news. */
export function NewsCard({
  id,
  className,
  news,
}: CardProps & { news: PortfolioNews }) {
  return (
    <Panel
      id={id}
      title={newsCopy.title}
      description={newsCopy.description}
      icon={NewspaperIcon}
      action={<SourceBadge news={news} />}
      className={className}
    >
      {news.items.length > 0 ? (
        <NewsFeed items={news.items} />
      ) : (
        <p className="text-sm text-muted-foreground">{newsCopy.empty}</p>
      )}
      <HiddenOpinion
        items={news.hiddenOpinion.slice(0, HIDDEN_SHOWN)}
        count={news.hiddenOpinion.length}
      />
      <p className="mt-auto pt-4 text-[11px] text-muted-foreground">
        {news.live
          ? `${newsCopy.attribution} ${news.provider}. ${newsCopy.liveNote}`
          : newsCopy.simulatedNote}
      </p>
    </Panel>
  )
}

/** Suspense fallback with the card's frame, so the layout doesn't jump. */
export function NewsSkeleton({ id, className }: CardProps) {
  return (
    <Panel
      id={id}
      title={newsCopy.title}
      description={newsCopy.description}
      icon={NewspaperIcon}
      className={className}
    >
      <p className="sr-only">{newsCopy.loading}</p>
      {/* Same shape as the feed: featured cover, then rows with thumbnails. */}
      <div
        aria-hidden
        className="grid animate-pulse gap-5 lg:grid-cols-[1.1fr_1fr] lg:gap-8"
      >
        <div className="space-y-3">
          <div className="aspect-video w-full rounded-xl bg-secondary" />
          <div className="h-3 w-32 rounded bg-secondary" />
          <div className="h-5 w-full rounded bg-secondary" />
          <div className="h-5 w-2/3 rounded bg-secondary" />
        </div>
        <div className="space-y-5">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-3">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-28 rounded bg-secondary" />
                <div className="h-4 w-full rounded bg-secondary" />
                <div className="h-4 w-20 rounded bg-secondary" />
              </div>
              <div className="size-16 shrink-0 rounded-lg bg-secondary sm:size-20" />
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}
