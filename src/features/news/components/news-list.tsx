import { formatPercent } from "@/features/preview/format"
import { cn } from "@/lib/utils"

import type { NewsAudience } from "../content"
import { newsCopy } from "../content"
import type { RankedNewsItem } from "../relevance"
import { companyName } from "../relevance"
import { NewsImage } from "./news-image"
import { NewsTime } from "./news-time"

/*
 * Editorial layout, the way financial news sites set a story list: type
 * carries the hierarchy (kicker, headline, standfirst, one quiet meta line),
 * hairlines separate the stories, and a photo appears only when the story
 * has one. No boxes, chips or placeholder tiles.
 */

/**
 * "23.9% of your portfolio" (every company in the story added up), or
 * "2.1% of your portfolio, via your funds" when it's only owned through funds.
 */
export function exposureLabel(item: RankedNewsItem) {
  const total = item.impact.reduce((sum, exposure) => sum + exposure.total, 0)
  const direct = item.impact.some((exposure) => exposure.direct > 0)
  const label = `${formatPercent(total)} ${newsCopy.impact.total}`
  return direct ? label : `${label}, ${newsCopy.impact.viaFunds}`
}

/** At most this many company names in a kicker; the rest become "+1". */
const KICKER_NAMES = 2

/** "NVIDIA · AMAZON +1": the companies the story touches, biggest first. */
function kickerText(item: RankedNewsItem) {
  const names = item.impact.map((exposure) => companyName(exposure.symbol))
  const shown = names.slice(0, KICKER_NAMES).join(" · ")
  const more = names.length - KICKER_NAMES
  return more > 0 ? `${shown} +${more}` : shown
}

/**
 * The line above the headline: the companies (or "OPINION" when muted) on
 * the left; for a portfolio, how much of it the story touches on the right.
 * It wraps cleanly on narrow screens, with no separator left dangling.
 */
function Kicker({
  item,
  audience,
  muted,
}: {
  item: RankedNewsItem
  audience: NewsAudience
  muted: boolean
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <p
        className={cn(
          "text-[11px] leading-none font-semibold tracking-[0.08em] uppercase",
          muted ? "text-muted-foreground" : "text-brand",
        )}
      >
        {muted ? newsCopy.hidden.tag : kickerText(item)}
      </p>
      {audience === "portfolio" && !muted && (
        <p className="text-xs leading-none font-medium text-brand tabular-nums">
          {exposureLabel(item)}
        </p>
      )}
    </div>
  )
}

/**
 * "Zacks Investment Research · 2h ago", on one line: a long source name is
 * cut with an ellipsis so the time always stays visible.
 */
function Meta({ item }: { item: RankedNewsItem }) {
  return (
    <p className="flex min-w-0 items-center gap-x-1.5 text-xs text-muted-foreground">
      <span
        className="min-w-0 truncate font-medium text-foreground/75"
        title={item.source}
      >
        {item.source}
      </span>
      <span aria-hidden className="shrink-0">
        ·
      </span>
      <span className="shrink-0">
        <NewsTime iso={item.publishedAt} />
      </span>
    </p>
  )
}

/** The headline, linked to the source (new tab) when there is one. */
function Headline({
  item,
  className,
}: {
  item: RankedNewsItem
  className?: string
}) {
  return (
    <h3 className={cn("font-semibold tracking-tight text-pretty", className)}>
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm decoration-1 underline-offset-[3px] outline-none hover:underline focus-visible:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {item.headline}
          <span className="sr-only"> {newsCopy.opensInNewTab}</span>
        </a>
      ) : (
        item.headline
      )}
    </h3>
  )
}

/** The lead: cover photo, kicker, large headline, standfirst, meta. */
function LeadStory({
  item,
  audience,
}: {
  item: RankedNewsItem
  audience: NewsAudience
}) {
  return (
    <article>
      <NewsImage
        src={item.image}
        href={item.url}
        className="mb-5 aspect-[16/9] w-full rounded-md"
      />
      <Kicker item={item} audience={audience} muted={false} />
      <Headline
        item={item}
        className="mt-2.5 line-clamp-3 text-xl leading-snug sm:text-2xl sm:leading-tight"
      />
      {item.summary && (
        <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">
          {item.summary}
        </p>
      )}
      <div className="mt-3">
        <Meta item={item} />
      </div>
    </article>
  )
}

/** A secondary story: text on the left, a small photo on the right if any. */
function StoryRow({
  item,
  audience,
  muted = false,
  withImage = true,
}: {
  item: RankedNewsItem
  audience: NewsAudience
  muted?: boolean
  withImage?: boolean
}) {
  return (
    <article className="flex gap-4">
      <div className="min-w-0 flex-1">
        <Kicker item={item} audience={audience} muted={muted} />
        <Headline
          item={item}
          className={cn(
            "mt-2 line-clamp-3 text-[15px] leading-snug",
            muted && "font-medium text-muted-foreground",
          )}
        />
        <div className="mt-2">
          <Meta item={item} />
        </div>
      </div>
      {withImage && (
        <NewsImage
          src={item.image}
          href={item.url}
          className="aspect-[3/2] w-24 shrink-0 self-start rounded-sm sm:w-28"
        />
      )}
    </article>
  )
}

/** Editorial (a lead story with its photo) or compact (rows only). */
export type NewsLayout = "editorial" | "compact"

/**
 * Editorial: the newest story with a photo leads (or the newest, if none has
 * one); the rest run down a column beside it on large screens, below it on
 * phones. Compact (inside a dashboard): every story as a row with a small
 * photo, in two columns from md up, so the card stays short.
 */
export function NewsFeed({
  items,
  audience = "portfolio",
  layout = "editorial",
}: {
  items: RankedNewsItem[]
  audience?: NewsAudience
  layout?: NewsLayout
}) {
  if (layout === "compact") {
    return (
      <ul className="grid gap-x-8 md:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="border-t border-border py-4 first:border-t-0 first:pt-0 md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(2)]:pt-0"
          >
            <StoryRow item={item} audience={audience} />
          </li>
        ))}
      </ul>
    )
  }
  const lead = items.find((item) => item.image) ?? items[0]
  if (!lead) return null
  const rest = items.filter((item) => item !== lead)
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-0">
      <div className="lg:col-span-7 lg:pr-8">
        <LeadStory item={lead} audience={audience} />
      </div>
      {rest.length > 0 && (
        <ul className="divide-y divide-border border-t border-border lg:col-span-5 lg:border-t-0 lg:border-l lg:pl-8">
          {rest.map((item) => (
            <li key={item.id} className="py-4 lg:first:pt-0 lg:last:pb-0">
              <StoryRow item={item} audience={audience} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Text-only rows, for the hidden opinion pieces (muted, tagged "Opinion"). */
export function NewsList({
  items,
  muted = false,
  audience = "portfolio",
}: {
  items: RankedNewsItem[]
  muted?: boolean
  audience?: NewsAudience
}) {
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li key={item.id} className="py-4 first:pt-0 last:pb-0">
          <StoryRow
            item={item}
            audience={audience}
            muted={muted}
            withImage={false}
          />
        </li>
      ))}
    </ul>
  )
}
