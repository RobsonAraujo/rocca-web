import type { NewsAudience } from "../content"
import { getPortfolioNews } from "../get-portfolio-news"
import { NewsCard } from "./news-card"

/**
 * Fetches the (cached) news and renders the card. Server only: render it
 * inside <Suspense fallback={<NewsSkeleton />}>. Pass `audience="public"`
 * where no account is connected (the landing).
 */
export async function NewsWidget({
  id,
  className,
  audience,
}: {
  id: string
  className?: string
  audience?: NewsAudience
}) {
  const news = await getPortfolioNews()
  return (
    <NewsCard id={id} className={className} audience={audience} news={news} />
  )
}
