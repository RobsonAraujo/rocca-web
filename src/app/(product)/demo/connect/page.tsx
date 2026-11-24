import type { Metadata } from "next"

import { Connect } from "@/features/demo/connect"

export const metadata: Metadata = { title: "Connect your accounts" }

export default function DemoConnectPage() {
  return <Connect />
}
