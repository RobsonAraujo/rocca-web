"use client"

import { Maximize2Icon } from "lucide-react"
import Link from "next/link"

import { ChatComposer, ComposerNote } from "../chat/composer"
import { ChatThread } from "../chat/thread"
import { ASK_PATH } from "../constants"
import { ask } from "../data"
import { HandleSheet, askSheet } from "./sheet"

/**
 * The chat on phones: a keyboard-aware bottom sheet opened from the tab
 * bar's center button or the Ask bar on Home. Same conversation as the
 * desktop panel and the full chat page. Mounted once, in the shell.
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
        <ChatThread />
        <div>
          <ChatComposer />
          <ComposerNote className="mt-2" />
        </div>
        {/* A real link (not a Close button) that also closes the sheet. */}
        <Link
          href={ASK_PATH}
          onClick={() => askSheet.close()}
          className="mx-auto flex h-10 w-fit items-center justify-center gap-2 rounded-xl px-3 text-sm text-muted-foreground outline-none active:bg-secondary"
        >
          <Maximize2Icon className="size-4" aria-hidden />
          {ask.openFull}
        </Link>
      </div>
    </HandleSheet>
  )
}
