"use client"

import { Maximize2Icon, SparklesIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

import { cn } from "@/lib/utils"

import { NewChatButton } from "../chat/ask-page"
import { useChat } from "../chat/chat-state"
import { ASK_INPUT_ID, ChatComposer, ComposerNote } from "../chat/composer"
import { ChatThread } from "../chat/thread"
import { ASK_PATH } from "../constants"
import { ask, shell } from "../data"
import {
  SidePanel,
  SidePanelTrigger,
  askPanel,
  panelIconClass,
} from "./side-panel"

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
 * Quick Ask Rocca on tablets and desktop: a side panel available on every
 * preview page, opened from the top bar or with ⌘K / Ctrl+K (on the full
 * chat page, ⌘K focuses its field instead). Same conversation as the full
 * chat, which "Open full chat" continues. Mounted once, in the shell
 * (phones use the Ask sheet).
 */
export function AskPanel() {
  const pathname = usePathname()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!isAskShortcut(event)) return
      event.preventDefault()
      if (pathname === ASK_PATH) {
        document.getElementById(ASK_INPUT_ID)?.focus()
      } else if (askPanel.isOpen) {
        askPanel.close()
      } else {
        askPanel.open(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pathname])

  return (
    <SidePanel
      handle={askPanel}
      title={ask.label}
      description={ask.description}
      actions={
        <>
          <NewChatButton iconOnly />
          {/* A real link (not a Close button) that also closes the panel. */}
          <Link
            href={ASK_PATH}
            onClick={() => askPanel.close()}
            aria-label={ask.openFull}
            className={panelIconClass}
          >
            <Maximize2Icon className="size-4" aria-hidden />
          </Link>
        </>
      }
      footer={
        <>
          <ChatComposer autoFocus />
          <ComposerNote className="mt-2" />
        </>
      }
    >
      <ChatThread />
    </SidePanel>
  )
}

const triggerClass =
  "flex h-9 scroll-mt-24 items-center gap-2.5 rounded-lg border border-border bg-card pr-1.5 pl-3 text-left text-sm text-muted-foreground transition-colors outline-none hover:border-input hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

function TriggerContent() {
  return (
    <>
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
    </>
  )
}

/**
 * Search-like field in the top bar: it opens the Ask panel. On the full
 * chat page it focuses the page's own field instead.
 */
export function AskTrigger({ className }: { className?: string }) {
  const pathname = usePathname()
  if (pathname === ASK_PATH) {
    return (
      <button
        type="button"
        id={ASK_TRIGGER_ID}
        aria-label={shell.askTrigger.label}
        onClick={() => document.getElementById(ASK_INPUT_ID)?.focus()}
        className={cn(triggerClass, className)}
      >
        <TriggerContent />
      </button>
    )
  }
  return (
    <SidePanelTrigger
      id={ASK_TRIGGER_ID}
      handle={askPanel}
      aria-label={shell.askTrigger.label}
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(triggerClass, className)}
    >
      <TriggerContent />
    </SidePanelTrigger>
  )
}

/**
 * "Ask why" on the decision card: asks Rocca why, in the side panel, so
 * the answer (with the trade) types out right beside the card.
 */
export function AskWhyButton({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { send } = useChat()
  return (
    <SidePanelTrigger
      handle={askPanel}
      onClick={() => send(ask.askWhy)}
      className={className}
    >
      {children}
    </SidePanelTrigger>
  )
}
