import { AskComposer, SampleThread } from "../components/ask-rocca"
import { ask } from "../data"
import { HandleSheet, askSheet } from "./sheet"

/**
 * The chat on phones: a keyboard-aware bottom sheet opened from the tab
 * bar's center button or the Ask bar on Home. Mounted once, in the shell.
 */
export function AskSheet() {
  return (
    <HandleSheet
      handle={askSheet}
      keyboardAware
      title={ask.label}
      description={ask.description}
    >
      <div className="space-y-5">
        <SampleThread />
        <AskComposer />
      </div>
    </HandleSheet>
  )
}
