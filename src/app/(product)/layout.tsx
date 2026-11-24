import { DemoSessionProvider } from "@/features/demo/session"

/**
 * Shared by the recordable demo (/demo) and the dashboard preview
 * (/preview). The demo session lives here, so it survives the navigation
 * from the demo's first look to the dashboard. The route group adds nothing
 * to the URLs.
 */
export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DemoSessionProvider>{children}</DemoSessionProvider>
}
