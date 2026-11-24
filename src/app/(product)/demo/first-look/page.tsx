import type { Metadata } from "next"

import { FirstLook } from "@/features/demo/first-look"

export const metadata: Metadata = { title: "Your first look" }

export default function DemoFirstLookPage() {
  return <FirstLook />
}
