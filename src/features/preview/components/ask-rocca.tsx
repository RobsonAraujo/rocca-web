"use client"

import {
  ArrowUpIcon,
  GraduationCapIcon,
  MicIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"

import { LogoMark } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconTile } from "@/components/product/tone"

import { ask } from "../data"
import { ComingSoonButton } from "./coming-soon"
import { WaitlistNote } from "./waitlist-note"
import { panelClass } from "./panel"

function UserBubble({ you, children }: { you: string; children: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] rounded-2xl rounded-tr-md bg-secondary px-4 py-2.5 text-sm whitespace-pre-line">
        <span className="sr-only">{you}: </span>
        {children}
      </p>
    </div>
  )
}

function RoccaBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand">
        <LogoMark className="size-4 text-brand-foreground" />
      </span>
      <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-brand/15 bg-brand/[0.05] px-4 py-2.5 text-sm leading-relaxed">
        <span className="sr-only">Rocca: </span>
        {children}
      </div>
    </div>
  )
}

/** A short example exchange, so visitors see the plain-English tone. */
export function SampleThread() {
  const { sample } = ask
  return (
    <div aria-label={sample.label} role="group" className="space-y-3">
      <UserBubble you={sample.you}>{sample.question}</UserBubble>
      <RoccaBubble>
        <p>{sample.answer}</p>
        <p className="mt-1.5 text-muted-foreground">{sample.followUp}</p>
      </RoccaBubble>
    </div>
  )
}

/** How long the "typing" indicator shows before a canned answer. */
export const TYPING_MS = 700

type Exchange = { id: number; question: string; answer: string | null }

/** Canned answer for a suggestion; anything else gets the fallback. */
export function answerFor(question: string) {
  return ask.answers[question.trim()] ?? null
}

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    return false
  }
}

/** The questions asked in this visit, with Rocca's simulated answers. */
function Thread({ exchanges }: { exchanges: Exchange[] }) {
  if (exchanges.length === 0) return null
  return (
    <div aria-live="polite" className="space-y-3">
      {exchanges.map((exchange) => {
        const canned = answerFor(exchange.question)
        return (
          <div
            key={exchange.id}
            className="animate-in space-y-3 duration-300 fade-in"
          >
            <UserBubble you={ask.sample.you}>{exchange.question}</UserBubble>
            <RoccaBubble>
              {exchange.answer === null ? (
                <p className="text-muted-foreground">{ask.thinking}</p>
              ) : (
                <>
                  <p>{exchange.answer}</p>
                  {!canned && <WaitlistNote className="mt-2" />}
                </>
              )}
            </RoccaBubble>
          </div>
        )
      })}
    </div>
  )
}

/**
 * ChatGPT-style composer: the textarea grows with the text (CSS
 * field-sizing, no JS), Enter sends and Shift+Enter breaks the line.
 * Suggestions fill the box; sending adds a simulated exchange with a canned
 * answer (or a fallback that points at the waitlist). Used by the desktop
 * card and by the mobile Ask sheet.
 */
export function AskComposer({ className }: { className?: string }) {
  const inputId = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const nextId = useRef(0)
  const [question, setQuestion] = useState("")
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const canSend = question.trim().length > 0

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  function send() {
    const text = question.trim()
    const id = nextId.current++
    const answer = answerFor(text) ?? ask.fallback
    setQuestion("")
    if (prefersReducedMotion()) {
      setExchanges((list) => [...list, { id, question: text, answer }])
      return
    }
    setExchanges((list) => [...list, { id, question: text, answer: null }])
    timers.current.push(
      setTimeout(() => {
        setExchanges((list) =>
          list.map((item) => (item.id === id ? { ...item, answer } : item)),
        )
      }, TYPING_MS),
    )
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Thread exchanges={exchanges} />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (canSend) send()
        }}
        className="rounded-2xl border border-input bg-background p-3 transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25"
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

      <div className="flex flex-wrap gap-2">
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
    </div>
  )
}

/** "Ask Rocca" card for desktop and tablet: header, example exchange, composer. */
export function AskRocca({ className }: { className?: string }) {
  const titleId = useId()
  return (
    <section
      id="ask"
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
      <AskComposer className="mt-auto" />
    </section>
  )
}
