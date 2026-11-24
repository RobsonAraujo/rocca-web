import type { Metadata } from "next"

import { AskPage } from "@/features/preview/chat/ask-page"

export const metadata: Metadata = { title: "Ask Rocca preview" }

export default function PreviewAskPage() {
  return <AskPage />
}
