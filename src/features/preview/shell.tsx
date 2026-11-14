import { Toaster } from "@/components/ui/sonner"
import { footer } from "@/features/landing/content"

import { Sidebar, TopBar } from "./components/navigation"

/**
 * Chrome shared by every preview page (rendered by app/preview/layout.tsx):
 * sidebar, top bar, the legal disclaimer and the toaster for coming-soon
 * notices. It stays mounted while moving between preview pages.
 */
export function PreviewShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-secondary/50 text-foreground selection:bg-brand/15">
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar />
        <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
          <p className="max-w-3xl pt-2 pb-4 text-xs leading-relaxed text-muted-foreground">
            {footer.disclaimer}
          </p>
        </main>
      </div>
      <Toaster theme="light" position="top-center" />
    </div>
  )
}
