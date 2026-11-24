import type { Metadata, Viewport } from "next"

import { DemoFlowShell } from "@/features/demo/flow-shell"

export const metadata: Metadata = {
  // A scripted demo with a fictional investor: keep it out of search.
  robots: { index: false, follow: false },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  colorScheme: "light",
}

export default function DemoLayout({ children }: LayoutProps<"/demo">) {
  return <DemoFlowShell>{children}</DemoFlowShell>
}
