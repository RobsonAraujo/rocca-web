import type { Viewport } from "next"
import { Suspense } from "react"

import { Landing } from "@/features/landing/landing"
import { NewsSkeleton } from "@/features/news/components/news-card"
import { NewsWidget } from "@/features/news/components/news-widget"

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  colorScheme: "light",
}

export default function HomePage() {
  return (
    <Landing
      news={
        // No account is connected on the landing: the card only names the
        // companies, never "your money".
        <Suspense
          fallback={<NewsSkeleton id="live-news-card" audience="public" />}
        >
          <NewsWidget id="live-news-card" audience="public" />
        </Suspense>
      }
    />
  )
}
