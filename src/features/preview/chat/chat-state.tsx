"use client"

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import type { AnswerBlock, AskScript } from "../data"
import { ask } from "../data"

/** How long Rocca "thinks" before the first words appear. */
export const THINKING_MS = 600
/** One typing step: `WORDS_PER_TICK` more words every `TICK_MS`. */
export const TICK_MS = 35
const WORDS_PER_TICK = 2
/** A component inside an answer counts as this many words: a short beat. */
export const COMPONENT_COST = 6

export type Answer = {
  blocks: readonly AnswerBlock[]
  sources: readonly string[]
  followUps: readonly string[]
  /** No script for the question: the answer points at the waitlist. */
  fallback: boolean
}

export type Phase = "thinking" | "streaming" | "done"

export type Exchange = {
  id: number
  question: string
  answer: Answer
  phase: Phase
  /** How many words of the answer are on screen (see `answerLength`). */
  shown: number
}

const normalize = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[?!.\s]+$/, "")

/** The scripted answer for a question (or an alias of one), else the fallback. */
export function answerFor(question: string): Answer {
  const key = normalize(question)
  const scripts: readonly AskScript[] = ask.scripts
  const script = scripts.find((item) =>
    [item.question, ...(item.aliases ?? [])].some(
      (text) => normalize(text) === key,
    ),
  )
  return script
    ? { ...script, fallback: false }
    : { ...ask.fallback, fallback: true }
}

export function blockLength(block: AnswerBlock) {
  if (block.type === "text") return block.text.split(" ").length
  if (block.type === "list") {
    return block.items.reduce((sum, item) => sum + item.split(" ").length, 0)
  }
  return COMPONENT_COST
}

/** Total "words" to type, components included. */
export function answerLength(answer: Answer) {
  return answer.blocks.reduce((sum, block) => sum + blockLength(block), 0)
}

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    return false
  }
}

type ChatState = {
  exchanges: Exchange[]
  /** An answer is still being thought or typed. */
  busy: boolean
  send: (question: string) => void
  /** Finishes the answer being typed, at once. */
  stop: () => void
  /** Types an answer again from the start. */
  retry: (id: number) => void
  /** Clears the conversation (New chat). */
  reset: () => void
}

const ChatContext = createContext<ChatState | null>(null)

/**
 * The simulated Ask Rocca conversation, shared by the side panel, the full
 * chat page and the phone sheet, so a chat started in one continues in the
 * others. It lives in the preview layout and isn't persisted. Answers are
 * scripted and typed out word by word, like a streaming model (instantly
 * for people who prefer reduced motion).
 */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const nextId = useRef(0)
  const timers = useRef<{
    timeout?: ReturnType<typeof setTimeout>
    interval?: ReturnType<typeof setInterval>
  }>({})

  const clearTimers = useCallback(() => {
    clearTimeout(timers.current.timeout)
    clearInterval(timers.current.interval)
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const update = useCallback((id: number, patch: Partial<Exchange>) => {
    setExchanges((list) =>
      list.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }, [])

  /** Every answer still in progress, shown in full. */
  const finishAll = useCallback(() => {
    clearTimers()
    setExchanges((list) =>
      list.map((item) =>
        item.phase === "done"
          ? item
          : { ...item, phase: "done", shown: answerLength(item.answer) },
      ),
    )
  }, [clearTimers])

  /** Thinks, then types the answer of `id` from the first word. */
  const play = useCallback(
    (id: number, total: number) => {
      clearTimers()
      if (prefersReducedMotion()) {
        update(id, { phase: "done", shown: total })
        return
      }
      update(id, { phase: "thinking", shown: 0 })
      timers.current.timeout = setTimeout(() => {
        let shown = 0
        update(id, { phase: "streaming" })
        timers.current.interval = setInterval(() => {
          shown = Math.min(shown + WORDS_PER_TICK, total)
          const done = shown >= total
          update(id, { shown, phase: done ? "done" : "streaming" })
          if (done) clearInterval(timers.current.interval)
        }, TICK_MS)
      }, THINKING_MS)
    },
    [clearTimers, update],
  )

  const send = useCallback(
    (question: string) => {
      const text = question.trim()
      if (!text) return
      finishAll()
      const id = nextId.current++
      const answer = answerFor(text)
      setExchanges((list) => [
        ...list,
        { id, question: text, answer, phase: "thinking", shown: 0 },
      ])
      play(id, answerLength(answer))
    },
    [finishAll, play],
  )

  const retry = useCallback(
    (id: number) => {
      finishAll()
      const item = exchanges.find((exchange) => exchange.id === id)
      if (item) play(id, answerLength(item.answer))
    },
    [exchanges, finishAll, play],
  )

  const reset = useCallback(() => {
    clearTimers()
    setExchanges([])
  }, [clearTimers])

  const busy = exchanges.some((item) => item.phase !== "done")

  const value = useMemo(
    () => ({ exchanges, busy, send, stop: finishAll, retry, reset }),
    [exchanges, busy, send, finishAll, retry, reset],
  )

  return <ChatContext value={value}>{children}</ChatContext>
}

export function useChat() {
  const value = use(ChatContext)
  if (!value) throw new Error("useChat must be used inside ChatProvider")
  return value
}
