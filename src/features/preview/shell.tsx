import { Toaster } from "@/components/ui/sonner"
import { footer } from "@/features/landing/content"

import { ChatProvider } from "./chat/chat-state"
import { AskPanel } from "./components/ask-panel"
import { TopBar } from "./components/navigation"
import { Sidebar } from "./components/sidebar"
import { DemoStateProvider } from "./demo-state"
import { MobileAppBar } from "./mobile/app-bar"
import { AskSheet } from "./mobile/ask-sheet"
import { MenuSheet } from "./mobile/menu-sheet"
import { MobileTabBar } from "./mobile/tab-bar"

/**
 * Chrome shared by every preview page (rendered by app/preview/layout.tsx):
 * collapsible sidebar, top bar with Ask Rocca, the Ask side panel (also on
 * ⌘K), the legal disclaimer and the toaster for coming-soon notices. It
 * stays mounted while moving between preview pages, and so do the
 * simulated demo state (DemoStateProvider) and the Ask Rocca conversation
 * (ChatProvider), shared by the panel, the full chat and the phone sheet.
 *
 * Phones (< md) get a native-app shell instead: compact app bar, bottom tab
 * bar and the Ask sheet.
 */
export function PreviewShell({ children }: { children: React.ReactNode }) {
  return (
    // No grey tap flash and no double-tap zoom delay: taps feel native.
    <DemoStateProvider>
      <ChatProvider>
        <div className="min-h-svh touch-manipulation bg-canvas text-foreground [-webkit-tap-highlight-color:transparent] selection:bg-brand/15">
          <Sidebar />
          {/* Next sibling of the sidebar: follows its width as it collapses. */}
          <div className="transition-[padding] duration-200 ease-out motion-reduce:transition-none lg:pl-64 lg:peer-data-[state=collapsed]/sidebar:pl-18">
            <TopBar className="max-md:hidden" />
            <MobileAppBar />
            {/* Phones: bottom padding clears the tab bar and the home indicator. */}
            <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 max-md:pt-5 max-md:pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:py-7">
              {children}
              <p className="max-w-3xl pt-2 pb-4 text-xs leading-relaxed text-muted-foreground">
                {footer.disclaimer}
              </p>
            </main>
          </div>
          <MobileTabBar />
          <AskSheet />
          <AskPanel />
          <MenuSheet />
          <Toaster theme="light" position="top-center" />
        </div>
      </ChatProvider>
    </DemoStateProvider>
  )
}
