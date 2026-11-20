import { getPortfolioNews } from "../get-portfolio-news"
import { NewsCard } from "./news-card"

/**
 * Fetches the (cached) portfolio news and renders the card. Server only:
 * render it inside <Suspense fallback={<NewsSkeleton />}>.
 */
export async function NewsWidget({
  id,
  className,
}: {
  id: string
  className?: string
}) {
  const news = await getPortfolioNews()
  return <NewsCard id={id} className={className} news={news} />
}
