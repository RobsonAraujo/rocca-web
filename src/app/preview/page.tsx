import type { Metadata } from "next"

import { Overview } from "@/features/preview/overview"

export const metadata: Metadata = { title: "Dashboard preview" }

export default function PreviewPage() {
  return <Overview />
}
