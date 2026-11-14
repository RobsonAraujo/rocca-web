import type { Metadata, Viewport } from "next"

import { PreviewShell } from "@/features/preview/shell"

export const metadata: Metadata = {
  // Shown after a waitlist signup with simulated data: keep it out of search.
  robots: { index: false, follow: false },
  // "Add to Home Screen" opens the preview full screen, like an installed app.
  appleWebApp: { capable: true, title: "Rocca", statusBarStyle: "default" },
  // Keep iOS from turning dollar amounts into phone-number links.
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  colorScheme: "light",
  // Lets the app bar and tab bar extend under the notch and home indicator
  // (they pad themselves with env(safe-area-inset-*)).
  viewportFit: "cover",
}

export default function PreviewLayout({ children }: LayoutProps<"/preview">) {
  return <PreviewShell>{children}</PreviewShell>
}
