import type { Metadata } from "next"

import { LearnPage } from "@/features/preview/learn/learn-page"

export const metadata: Metadata = { title: "Learn preview" }

export default function PreviewLearnPage() {
  return <LearnPage />
}
