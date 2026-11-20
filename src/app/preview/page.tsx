import type { Metadata } from "next"
import { Suspense } from "react"

import { NewsSkeleton } from "@/features/news/components/news-card"
import { NewsWidget } from "@/features/news/components/news-widget"
import { OverviewScreen } from "@/features/preview/overview-screen"

export const metadata: Metadata = { title: "Dashboard preview" }

export default function PreviewPage() {
  return (
    <OverviewScreen
      news={
        <Suspense fallback={<NewsSkeleton id="news" />}>
          <NewsWidget id="news" />
        </Suspense>
      }
      mobileNews={
        <Suspense fallback={<NewsSkeleton id="m-news" />}>
          <NewsWidget id="m-news" />
        </Suspense>
      }
    />
  )
}
