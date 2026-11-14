import type { Metadata, Viewport } from "next"

import { DarkLanding } from "@/features/landing/dark/dark-landing"

export const metadata: Metadata = {
  title: "Dark layout",
  // Preview of an alternative layout: keep it out of search results.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: "#0b0d12",
  colorScheme: "dark",
}

export default function DarkLayoutPage() {
  return <DarkLanding />
}
