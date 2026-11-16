import { render } from "@testing-library/react"

import { DemoStateProvider } from "./demo-state"

/** Renders preview UI inside the demo state the preview layout provides. */
export function renderWithDemo(ui: React.ReactElement) {
  return render(ui, { wrapper: DemoStateProvider })
}
