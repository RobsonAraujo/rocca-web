"use client"

import {
  ArrowUpIcon,
  GraduationCapIcon,
  MicIcon,
  PlusIcon,
  SquareIcon,
} from "lucide-react"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { ask } from "../data"
import { useChat } from "./chat-state"

/** Id of the full chat page's field: ⌘K focuses it there. */
export const ASK_INPUT_ID = "ask-input"

/**
 * ChatGPT-style composer: a rounded box whose textarea grows with the text
 * (CSS field-sizing, no JS). Enter sends, Shift+Enter breaks the line.
 * While Rocca answers, Send turns into Stop, which shows the answer at once.
 * Attach, voice and "Explain simply" need the real product (coming soon).
 */
export function ChatComposer({
  id,
  autoFocus = false,
  size = "default",
  className,
}: {
  id?: string
  autoFocus?: boolean
  /** `large`: the empty chat page, where the box is the centerpiece. */
  size?: "default" | "large"
  className?: string
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const { send, stop, busy } = useChat()
  const [question, setQuestion] = useState("")
  const canSend = question.trim().length > 0 && !busy

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!canSend) return
        send(question)
        setQuestion("")
      }}
      className={cn(
        "rounded-3xl border border-border bg-card p-2 shadow-soft transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20",
        className,
      )}
    >
      <label htmlFor={inputId} className="sr-only">
        {ask.inputLabel}
      </label>
      <textarea
        id={inputId}
        rows={1}
        autoFocus={autoFocus}
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={(event) => {
          // Enter sends, Shift+Enter breaks the line. Skip while an IME
          // (e.g. accented characters) is still composing.
          if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
          }
        }}
        placeholder={ask.placeholder}
        className={cn(
          "block field-sizing-content max-h-48 w-full resize-none bg-transparent px-3 py-2 leading-relaxed outline-none placeholder:text-muted-foreground",
          size === "large" ? "min-h-16 text-base" : "min-h-11 text-[15px]",
        )}
      />
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <ComingSoonButton
            variant="ghost"
            size="icon-sm"
            aria-label={ask.attach}
            className="size-8 rounded-full text-muted-foreground"
          >
            <PlusIcon aria-hidden />
          </ComingSoonButton>
          <ComingSoonButton
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-2.5 text-muted-foreground"
          >
            <GraduationCapIcon className="text-learn" aria-hidden />
            {ask.explainSimply}
          </ComingSoonButton>
        </div>
        <div className="flex items-center gap-1">
          <ComingSoonButton
            variant="ghost"
            size="icon-sm"
            aria-label={ask.voice}
            className="size-8 rounded-full text-muted-foreground"
          >
            <MicIcon aria-hidden />
          </ComingSoonButton>
          {busy ? (
            <Button
              type="button"
              size="icon"
              aria-label={ask.stop}
              onClick={stop}
              className="size-8 rounded-full"
            >
              <SquareIcon className="size-3 fill-current" aria-hidden />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              aria-label={ask.submit}
              disabled={!canSend}
              className="size-8 rounded-full"
            >
              <ArrowUpIcon aria-hidden />
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}

/** The quiet line under the composer, like any AI chat's disclaimer. */
export function ComposerNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-center text-xs text-muted-foreground", className)}>
      {ask.disclaimer}
    </p>
  )
}
