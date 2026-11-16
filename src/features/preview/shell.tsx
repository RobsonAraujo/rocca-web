import { Toaster } from "@/components/ui/sonner"
import { footer } from "@/features/landing/content"

import { Sidebar, TopBar } from "./components/navigation"
import { DemoStateProvider } from "./demo-state"
import { MobileAppBar } from "./mobile/app-bar"
import { AskSheet } from "./mobile/ask-sheet"
import { MenuSheet } from "./mobile/menu-sheet"
import { MobileTabBar } from "./mobile/tab-bar"

/**
 * Chrome shared by every preview page (rendered by app/preview/layout.tsx):
 * sidebar, top bar, the legal disclaimer and the toaster for coming-soon
 * notices. It stays mounted while moving between preview pages, and so
 * does the simulated demo state (DemoStateProvider).
 *
 * Phones (< md) get a native-app shell instead: compact app bar, bottom tab
 * bar and the Ask sheet. Tablets and desktop are unchanged.
 */
export function PreviewShell({ children }: { children: React.ReactNode }) {
  return (
    // No grey tap flash and no double-tap zoom delay: taps feel native.
    <DemoStateProvider>
      <div className="min-h-svh touch-manipulation bg-secondary/50 text-foreground [-webkit-tap-highlight-color:transparent] selection:bg-brand/15">
        <Sidebar />
        <div className="lg:pl-64">
          <TopBar className="max-md:hidden" />
          <MobileAppBar />
          {/* Phones: bottom padding clears the tab bar and the home indicator. */}
          <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 max-md:pt-5 max-md:pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:py-8">
            {children}
            <p className="max-w-3xl pt-2 pb-4 text-xs leading-relaxed text-muted-foreground">
              {footer.disclaimer}
            </p>
          </main>
        </div>
        <MobileTabBar />
        <AskSheet />
        <MenuSheet />
        <Toaster theme="light" position="top-center" />
      </div>
    </DemoStateProvider>
  )
}
