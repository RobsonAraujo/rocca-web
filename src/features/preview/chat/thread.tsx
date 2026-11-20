"use client"

import {
  ActivityIcon,
  ChartPieIcon,
  LandmarkIcon,
  ScissorsIcon,
} from "lucide-react"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

import { ask } from "../data"
import { useChat } from "./chat-state"
import { AssistantMessage, RoccaAvatar, UserMessage } from "./message"

/** An icon per starter, in `ask.suggestions` order. */
const starterIcons = [ActivityIcon, ChartPieIcon, ScissorsIcon, LandmarkIcon]

/**
 * The questions the preview answers, as one-tap starters. `cards` (the
 * full page) lays them out in a 2×2 grid; `list` (panel, sheet) stacks them.
 */
export function Starters({
  layout = "list",
  className,
}: {
  layout?: "cards" | "list"
  className?: string
}) {
  const { send } = useChat()
  return (
    <ul
      className={cn(
        layout === "cards" ? "grid gap-2 sm:grid-cols-2" : "space-y-1.5",
        className,
      )}
    >
      {ask.suggestions.map((question, index) => {
        const Icon = starterIcons[index] ?? ActivityIcon
        return (
          <li key={question}>
            <button
              type="button"
              onClick={() => send(question)}
              className={cn(
                "flex w-full items-center gap-2.5 border border-border bg-card text-left text-sm transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                layout === "cards"
                  ? "rounded-2xl px-4 py-3"
                  : "rounded-xl px-3 py-2.5",
              )}
            >
              <Icon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              {question}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

/** The empty panel or sheet: who's answering, and where to start. */
function CompactEmpty() {
  return (
    <div>
      <div className="flex items-start gap-3">
        <RoccaAvatar />
        <div>
          <p className="font-semibold tracking-tight">{ask.greeting}</p>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {ask.greetingNote}
          </p>
        </div>
      </div>
      <Starters className="mt-4" />
    </div>
  )
}

/**
 * The conversation: questions on the right, answers on the left, newest at
 * the bottom (kept in view while Rocca types). A `log` region, marked busy
 * while an answer types, so screen readers read it once it's complete.
 * Empty, it shows the compact start (the full page has its own).
 */
export function ChatThread({ className }: { className?: string }) {
  const { exchanges, busy } = useChat()
  const end = useRef<HTMLDivElement>(null)
  const last = exchanges.at(-1)

  // Follow the answer as it grows.
  useEffect(() => {
    end.current?.scrollIntoView?.({ block: "end" })
  }, [exchanges.length, last?.shown, last?.phase])

  if (exchanges.length === 0) return <CompactEmpty />

  return (
    <div
      role="log"
      aria-label={ask.conversation}
      aria-busy={busy}
      className={cn("space-y-6", className)}
    >
      {exchanges.map((exchange) => (
        <div key={exchange.id} className="space-y-4">
          <UserMessage>{exchange.question}</UserMessage>
          <AssistantMessage
            exchange={exchange}
            latest={exchange.id === last?.id}
          />
        </div>
      ))}
      <div ref={end} className="scroll-mb-40" />
    </div>
  )
}
