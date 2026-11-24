import type { Metadata } from "next"

import { SignIn } from "@/features/demo/sign-in"

export const metadata: Metadata = { title: "Sign in" }

export default function DemoSignInPage() {
  return <SignIn />
}
