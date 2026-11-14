import type { Viewport } from "next"

import { LightLanding } from "@/features/landing/light/light-landing"

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  colorScheme: "light",
}

export default function HomePage() {
  return <LightLanding />
}
