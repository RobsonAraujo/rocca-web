"use client"

import {
  ArrowUpIcon,
  GraduationCapIcon,
  MicIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react"
import { useId, useRef, useState } from "react"

import { LogoMark } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ask } from "../data"
import { ComingSoonButton, notifyComingSoon } from "./coming-soon"
import { panelClass } from "./panel"
import { IconTile } from "./tone"

/** A short example exchange, so visitors see the plain-English tone. */
function SampleThread() {
  const { sample } = ask
  return (
    <div aria-label={sample.label} role="group" className="space-y-3">
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-tr-md bg-secondary px-4 py-2.5 text-sm">
          <span className="sr-only">{sample.you}: </span>
          {sample.question}
        </p>
      </div>
      <div className="flex items-start gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand">
          <LogoMark className="size-4 text-brand-foreground" />
        </span>
        <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-brand/15 bg-brand/[0.05] px-4 py-2.5 text-sm leading-relaxed">
          <span className="sr-only">Rocca: </span>
          <p>{sample.answer}</p>
          <p className="mt-1.5 text-muted-foreground">{sample.followUp}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * "Ask Rocca" card: an example exchange, then a ChatGPT-style composer whose
 * textarea grows with the text (CSS field-sizing, no JS). Sending only shows
 * the coming-soon notice; suggestions fill the box.
 */
export function AskRocca({ className }: { className?: string }) {
  const inputId = useId()
  const titleId = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [question, setQuestion] = useState("")
  const canSend = question.trim().length > 0

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col gap-5 bg-card p-5 ring-1 ring-foreground/10 sm:p-6",
        panelClass,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <IconTile icon={SparklesIcon} tone="brand" />
        <div>
          <h2 id={titleId} className="text-lg font-semibold tracking-tight">
            {ask.label}
          </h2>
          <p className="text-sm text-muted-foreground">{ask.description}</p>
        </div>
      </div>

      <SampleThread />

      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (canSend) notifyComingSoon()
        }}
        className="mt-auto rounded-2xl border border-input bg-background p-3 transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25"
      >
        <label htmlFor={inputId} className="sr-only">
          {ask.inputLabel}
        </label>
        <textarea
          id={inputId}
          ref={textareaRef}
          rows={2}
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
          className="block field-sizing-content max-h-56 min-h-14 w-full resize-none bg-transparent px-1 py-1 text-base leading-relaxed outline-none placeholder:text-muted-foreground"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
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
              className="rounded-full px-3 text-learn hover:text-learn"
            >
              <GraduationCapIcon aria-hidden />
              {ask.explainSimply}
            </ComingSoonButton>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground xl:inline">
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

      <div className="-mt-2 flex flex-wrap gap-2">
        {ask.suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full text-muted-foreground"
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
