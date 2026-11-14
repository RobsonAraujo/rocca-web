import type { Metadata, Viewport } from "next"

import { PreviewShell } from "@/features/preview/shell"

export const metadata: Metadata = {
  // Shown after a waitlist signup with simulated data: keep it out of search.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  colorScheme: "light",
}

export default function PreviewLayout({ children }: LayoutProps<"/preview">) {
  return <PreviewShell>{children}</PreviewShell>
}
