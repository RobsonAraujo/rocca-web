import type { Metadata } from "next"

import { Onboarding } from "@/features/demo/onboarding"

export const metadata: Metadata = { title: "Welcome" }

export default function DemoOnboardingPage() {
  return <Onboarding />
}
