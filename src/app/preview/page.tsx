import type { Metadata } from "next"
import { Suspense } from "react"

import { NewsSkeleton } from "@/features/news/components/news-card"
import { NewsWidget } from "@/features/news/components/news-widget"
import { OverviewScreen } from "@/features/preview/overview-screen"

export const metadata: Metadata = { title: "Dashboard preview" }

/** Desktop news card in the dashboard's surface: hairline, no shadow. */
const dashboardSurface = "rounded-xl shadow-none ring-border sm:p-6"

export default function PreviewPage() {
  return (
    <OverviewScreen
      news={
        <Suspense
          fallback={<NewsSkeleton id="news" className={dashboardSurface} />}
        >
          <NewsWidget id="news" className={dashboardSurface} />
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
