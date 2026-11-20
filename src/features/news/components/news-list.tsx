import { ArrowUpRightIcon } from "lucide-react"

import { formatPercent } from "@/features/preview/format"
import { cn } from "@/lib/utils"

import { newsCopy } from "../content"
import { formatNewsTime } from "../format"
import type { Exposure, RankedNewsItem } from "../relevance"
import { NewsImage } from "./news-image"

/** "NVDA · 22.1% of your money", or "AMZN · 2.1% via your funds". */
export function impactLabel(exposure: Exposure) {
  return exposure.direct > 0
    ? `${exposure.symbol} · ${formatPercent(exposure.total)} ${newsCopy.impact.total}`
    : `${exposure.symbol} · ${formatPercent(exposure.viaFunds)} ${newsCopy.impact.viaFunds}`
}

/** "Reuters · Nov 19, 3:42 PM ET", plus the Opinion tag when muted. */
function StoryMeta({
  item,
  muted = false,
}: {
  item: RankedNewsItem
  muted?: boolean
}) {
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
      <span className="font-medium">{item.source}</span>
      <span aria-hidden>·</span>
      <time dateTime={item.publishedAt}>
        {formatNewsTime(item.publishedAt)}
      </time>
      {muted && (
        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium">
          {newsCopy.hidden.tag}
        </span>
      )}
    </p>
  )
}

/** The headline, linked to the source when there is one (new tab). */
function StoryHeadline({
  item,
  className,
}: {
  item: RankedNewsItem
  className?: string
}) {
  return (
    <h3 className={cn("leading-snug text-pretty", className)}>
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {item.headline}
          <ArrowUpRightIcon
            className="ml-0.5 inline size-3.5 align-[-2px] text-muted-foreground"
            aria-hidden
          />
          <span className="sr-only"> {newsCopy.opensInNewTab}</span>
        </a>
      ) : (
        item.headline
      )}
    </h3>
  )
}

/** How much of the portfolio the story touches, one chip per ticker. */
function ImpactChips({ item }: { item: RankedNewsItem }) {
  return (
    <ul aria-label={newsCopy.impact.label} className="flex flex-wrap gap-1.5">
      {item.impact.map((exposure) => (
        <li
          key={exposure.symbol}
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap tabular-nums",
            exposure.direct > 0
              ? "bg-brand/10 text-brand"
              : "bg-secondary text-muted-foreground",
          )}
        >
          {impactLabel(exposure)}
        </li>
      ))}
    </ul>
  )
}

/** The ticker the story touches most: it labels the image fallback. */
const leadSymbol = (item: RankedNewsItem) => item.impact[0]?.symbol ?? ""

/** The newest story, big: cover image, headline, summary. */
function FeaturedStory({ item }: { item: RankedNewsItem }) {
  return (
    <article className="flex flex-col gap-3">
      <NewsImage
        src={item.image}
        href={item.url}
        symbol={leadSymbol(item)}
        featured
        className="aspect-video w-full rounded-xl"
      />
      <StoryMeta item={item} />
      <StoryHeadline item={item} className="text-lg font-semibold" />
      {item.summary && (
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {item.summary}
        </p>
      )}
      <ImpactChips item={item} />
    </article>
  )
}

/**
 * Blog-style feed: the newest story with a photo featured big, the rest as
 * rows with a thumbnail. Side by side on large screens, stacked below.
 */
export function NewsFeed({ items }: { items: RankedNewsItem[] }) {
  // The newest story with a real photo leads; without any, the newest does.
  const featured = items.find((item) => item.image) ?? items[0]
  if (!featured) return null
  const rest = items.filter((item) => item !== featured)
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
      <FeaturedStory item={featured} />
      {rest.length > 0 && (
        <ul className="divide-y divide-border max-lg:border-t max-lg:border-border max-lg:pt-1">
          {rest.map((item) => (
            <li key={item.id} className="flex gap-3 py-3 lg:first:pt-0">
              <div className="min-w-0 flex-1 space-y-1.5">
                <StoryMeta item={item} />
                <StoryHeadline item={item} className="text-sm font-medium" />
                <ImpactChips item={item} />
              </div>
              <NewsImage
                src={item.image}
                href={item.url}
                symbol={leadSymbol(item)}
                className="size-16 shrink-0 rounded-lg sm:size-20"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * Compact text-only list. Used for the hidden opinion pieces, which are
 * shown muted and tagged.
 */
export function NewsList({
  items,
  muted = false,
}: {
  items: RankedNewsItem[]
  muted?: boolean
}) {
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li key={item.id} className="space-y-1.5 py-3 first:pt-0 last:pb-0">
          <StoryMeta item={item} muted={muted} />
          <StoryHeadline
            item={item}
            className={cn(
              "text-sm font-medium",
              muted && "text-muted-foreground",
            )}
          />
          <ImpactChips item={item} />
        </li>
      ))}
    </ul>
  )
}
