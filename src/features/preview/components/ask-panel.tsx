"use client"

import { SparklesIcon } from "lucide-react"
import { useEffect } from "react"

import { cn } from "@/lib/utils"

import { ask, shell } from "../data"
import { AskComposer, SampleThread } from "./ask-rocca"
import { SidePanel, SidePanelTrigger, askPanel } from "./side-panel"

/** Id of the top bar field: the guided tour points at it. */
export const ASK_TRIGGER_ID = "ask"

/** ⌘K on a Mac, Ctrl+K elsewhere. */
export function isAskShortcut(event: KeyboardEvent) {
  return (
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === "k"
  )
}

/**
 * The chat on tablets and desktop: a side panel available on every preview
 * page, opened from the top bar or with ⌘K / Ctrl+K. Mounted once, in the
 * shell (phones use the Ask sheet instead).
 */
export function AskPanel() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!isAskShortcut(event)) return
      event.preventDefault()
      if (askPanel.isOpen) askPanel.close()
      else askPanel.open(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <SidePanel
      handle={askPanel}
      title={ask.label}
      description={ask.description}
    >
      <div className="space-y-5">
        <SampleThread />
        <AskComposer />
      </div>
    </SidePanel>
  )
}

/** Search-like field in the top bar: it opens the Ask panel. */
export function AskTrigger({ className }: { className?: string }) {
  return (
    <SidePanelTrigger
      id={ASK_TRIGGER_ID}
      handle={askPanel}
      aria-label={shell.askTrigger.label}
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "flex h-9 scroll-mt-24 items-center gap-2.5 rounded-lg border border-border bg-card pr-1.5 pl-3 text-left text-sm text-muted-foreground transition-colors hover:border-input hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <SparklesIcon className="size-4 shrink-0 text-brand" aria-hidden />
      <span className="min-w-0 flex-1 truncate">
        {shell.askTrigger.placeholder}
      </span>
      <kbd
        aria-hidden
        className="hidden h-6 items-center rounded-md border border-border bg-secondary px-1.5 font-sans text-[11px] font-medium text-muted-foreground sm:inline-flex"
      >
        ⌘K
      </kbd>
    </SidePanelTrigger>
  )
}
