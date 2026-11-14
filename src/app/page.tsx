import type { Viewport } from "next"

import { Landing } from "@/features/landing/landing"

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  colorScheme: "light",
}

export default function HomePage() {
  return <Landing />
}
