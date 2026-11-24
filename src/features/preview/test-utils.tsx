import { render } from "@testing-library/react"

import type { DemoSession } from "@/features/demo/session"
import { DemoSessionProvider } from "@/features/demo/session"

import { ChatProvider } from "./chat/chat-state"
import { DemoStateProvider } from "./demo-state"

/** A session that went through the whole /demo flow: the preview's first run. */
export const finishedSession: Partial<DemoSession> = {
  signedIn: true,
  level: "new",
  connected: ["Brokerage", "Roth IRA", "401(k)", "Crypto"],
  finished: true,
}

/**
 * Renders preview UI inside the state the preview layout provides: the
 * demo and the chat. Pass `session` to render it as the (product) layout
 * does after the recordable demo (e.g. `finishedSession` for a first run).
 */
export function renderWithDemo(
  ui: React.ReactElement,
  { session }: { session?: Partial<DemoSession> } = {},
) {
  function PreviewState({ children }: { children: React.ReactNode }) {
    const preview = (
      <DemoStateProvider>
        <ChatProvider>{children}</ChatProvider>
      </DemoStateProvider>
    )
    return session ? (
      <DemoSessionProvider initial={session}>{preview}</DemoSessionProvider>
    ) : (
      preview
    )
  }
  return render(ui, { wrapper: PreviewState })
}
