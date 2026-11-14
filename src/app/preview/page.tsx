import type { Metadata } from "next"

import { OverviewScreen } from "@/features/preview/overview-screen"

export const metadata: Metadata = { title: "Dashboard preview" }

export default function PreviewPage() {
  return <OverviewScreen />
}
