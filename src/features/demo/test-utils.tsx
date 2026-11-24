import { render } from "@testing-library/react"

import type { DemoSession } from "./session"
import { DemoSessionProvider, useDemoSession } from "./session"

/** Prints the session, so tests can check what a step stored. */
export function SessionProbe() {
  const { signedIn, level, connected, finished } = useDemoSession()
  return (
    <output data-testid="session">
      {JSON.stringify({ signedIn, level, connected, finished })}
    </output>
  )
}

export function readSession(element: HTMLElement): DemoSession {
  return JSON.parse(element.textContent ?? "{}") as DemoSession
}

/** Renders a demo step inside the session, as the (product) layout does. */
export function renderStep(
  ui: React.ReactElement,
  initial?: Partial<DemoSession>,
) {
  return render(
    <DemoSessionProvider initial={initial}>
      {ui}
      <SessionProbe />
    </DemoSessionProvider>,
  )
}
