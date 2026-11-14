"use client"

import {
  ArrowUpIcon,
  GraduationCapIcon,
  MicIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react"
import { useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

import { ask } from "../data"
import { ComingSoonButton, notifyComingSoon } from "./coming-soon"

/**
 * Chat composer in the style people know from ChatGPT: a roomy textarea that
 * grows with the text (CSS field-sizing, no JS), tools underneath and a round
 * send button. Sending only shows the coming-soon notice; the suggestions
 * fill the box so visitors can see how a question would look.
 */
export function AskRocca() {
  const inputId = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [question, setQuestion] = useState("")
  const canSend = question.trim().length > 0

  return (
    <section aria-label={ask.label} className="space-y-3">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (canSend) notifyComingSoon()
        }}
        className="rounded-3xl border border-border bg-card p-3 shadow-float transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25 sm:p-4"
      >
        <div className="flex gap-3">
          <span className="mt-1.5 hidden size-7 shrink-0 place-items-center rounded-full bg-brand/10 text-brand sm:grid">
            <SparklesIcon className="size-4" aria-hidden />
          </span>
          <label htmlFor={inputId} className="sr-only">
            {ask.inputLabel}
          </label>
          <textarea
            id={inputId}
            ref={textareaRef}
            rows={3}
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
            className="block field-sizing-content max-h-64 min-h-20 w-full flex-1 resize-none bg-transparent py-1.5 text-base leading-relaxed outline-none placeholder:text-muted-foreground sm:min-h-24"
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <ComingSoonButton
              variant="outline"
              size="icon-sm"
              aria-label={ask.attach}
              className="rounded-full"
            >
              <PlusIcon aria-hidden />
            </ComingSoonButton>
            <ComingSoonButton
              variant="outline"
              size="sm"
              className="rounded-full px-3 text-muted-foreground"
            >
              <GraduationCapIcon aria-hidden />
              {ask.explainSimply}
            </ComingSoonButton>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground md:inline">
              {ask.hint}
            </span>
            <ComingSoonButton
              variant="ghost"
              size="icon-sm"
              aria-label={ask.voice}
              className="rounded-full text-muted-foreground"
            >
              <MicIcon aria-hidden />
            </ComingSoonButton>
            <Button
              type="submit"
              size="icon"
              aria-label={ask.submit}
              disabled={!canSend}
              className="size-9 rounded-full"
            >
              <ArrowUpIcon aria-hidden />
            </Button>
          </div>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        {ask.suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full bg-card text-muted-foreground"
            onClick={() => {
              setQuestion(suggestion)
              textareaRef.current?.focus()
            }}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </section>
  )
}
