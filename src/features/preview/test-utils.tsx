import { render } from "@testing-library/react"

import { ChatProvider } from "./chat/chat-state"
import { DemoStateProvider } from "./demo-state"

/** The state the preview layout provides: the demo and the chat. */
function PreviewState({ children }: { children: React.ReactNode }) {
  return (
    <DemoStateProvider>
      <ChatProvider>{children}</ChatProvider>
    </DemoStateProvider>
  )
}

/** Renders preview UI inside the state the preview layout provides. */
export function renderWithDemo(ui: React.ReactElement) {
  return render(ui, { wrapper: PreviewState })
}
