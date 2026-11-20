"use client"

import {
  CheckIcon,
  CopyIcon,
  CornerDownRightIcon,
  RotateCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"
import { useState } from "react"

import { LogoMark } from "@/components/layout/logo"
import { cn } from "@/lib/utils"

import { WaitlistNote } from "../components/waitlist-note"
import type { AnswerBlock } from "../data"
import { ask } from "../data"
import { AnswerComponent } from "./blocks"
import type { Exchange } from "./chat-state"
import { blockLength, useChat } from "./chat-state"

/** "Mostly **NVDA**" -> "Mostly <strong>NVDA</strong>"; an unclosed ** while typing stays bold. */
function Inline({ text }: { text: string }) {
  return text.split("**").map((part, index) =>
    index % 2 ? (
      <strong key={index} className="font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

/** The blinking dot at the end of the text being typed. */
function Caret() {
  return (
    <span
      aria-hidden
      className="ml-1 inline-block size-2.5 animate-pulse rounded-full bg-foreground align-middle"
    />
  )
}

/**
 * The answer's blocks, cut at `shown` words: paragraphs and lists type out
 * word by word, components appear whole when the typing reaches them.
 */
function Blocks({
  blocks,
  shown,
  typing,
}: {
  blocks: readonly AnswerBlock[]
  shown: number
  typing: boolean
}) {
  let budget = shown
  const out: React.ReactNode[] = []
  for (const [index, block] of blocks.entries()) {
    if (budget <= 0) break
    const length = blockLength(block)
    const last = typing && budget <= length
    if (block.type === "text") {
      const text = block.text.split(" ").slice(0, budget).join(" ")
      out.push(
        <p key={index}>
          <Inline text={text} />
          {last && <Caret />}
        </p>,
      )
    } else if (block.type === "list") {
      let left = budget
      const items: string[] = []
      for (const item of block.items) {
        if (left <= 0) break
        const words = item.split(" ")
        items.push(words.slice(0, left).join(" "))
        left -= words.length
      }
      out.push(
        <ul
          key={index}
          className="list-disc space-y-1 pl-5 marker:text-muted-foreground"
        >
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>
              <Inline text={item} />
              {last && itemIndex === items.length - 1 && <Caret />}
            </li>
          ))}
        </ul>,
      )
    } else {
      out.push(<AnswerComponent key={index} type={block.type} />)
    }
    budget -= length
  }
  return out
}

/** The person's question: a grey bubble on the right. */
export function UserMessage({ children }: { children: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] rounded-3xl bg-secondary px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-line">
        <span className="sr-only">{ask.you}: </span>
        {children}
      </p>
    </div>
  )
}

/** Rocca's mark beside its answers. */
export function RoccaAvatar() {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand">
      <LogoMark className="size-4 text-brand-foreground" />
    </span>
  )
}

const actionClass =
  "grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:text-foreground"

/** Copy, rate and retry, under a finished answer. */
function Actions({ exchange }: { exchange: Exchange }) {
  const { retry } = useChat()
  const [copied, setCopied] = useState(false)
  const [rating, setRating] = useState<"good" | "bad" | null>(null)

  const copy = async () => {
    const text = exchange.answer.blocks
      .flatMap((block) =>
        block.type === "text"
          ? [block.text.replaceAll("**", "")]
          : block.type === "list"
            ? block.items.map((item) => `• ${item}`)
            : [],
      )
      .join("\n")
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // No clipboard (insecure context, old browser): nothing to copy into.
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="-ml-1.5 flex items-center gap-0.5">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? ask.actions.copied : ask.actions.copy}
        className={actionClass}
      >
        {copied ? (
          <CheckIcon className="size-4" aria-hidden />
        ) : (
          <CopyIcon className="size-4" aria-hidden />
        )}
      </button>
      <button
        type="button"
        aria-pressed={rating === "good"}
        aria-label={ask.actions.good}
        onClick={() => setRating(rating === "good" ? null : "good")}
        className={actionClass}
      >
        <ThumbsUpIcon
          className={cn("size-4", rating === "good" && "fill-current")}
          aria-hidden
        />
      </button>
      <button
        type="button"
        aria-pressed={rating === "bad"}
        aria-label={ask.actions.bad}
        onClick={() => setRating(rating === "bad" ? null : "bad")}
        className={actionClass}
      >
        <ThumbsDownIcon
          className={cn("size-4", rating === "bad" && "fill-current")}
          aria-hidden
        />
      </button>
      <button
        type="button"
        aria-label={ask.actions.retry}
        onClick={() => retry(exchange.id)}
        className={actionClass}
      >
        <RotateCcwIcon className="size-4" aria-hidden />
      </button>
    </div>
  )
}

/**
 * Rocca's answer, ChatGPT-style: no bubble, the mark on the left, text that
 * types itself out, components inline. Once done: the sources, actions and
 * (on the latest answer) follow-up questions.
 */
export function AssistantMessage({
  exchange,
  latest,
}: {
  exchange: Exchange
  latest: boolean
}) {
  const { send } = useChat()
  const { answer, phase, shown } = exchange
  const done = phase === "done"
  return (
    <div className="flex gap-3">
      <RoccaAvatar />
      <div className="min-w-0 flex-1 space-y-3 pt-0.5 text-[15px] leading-relaxed">
        <span className="sr-only">Rocca: </span>
        {phase === "thinking" ? (
          <p className="animate-pulse text-muted-foreground">{ask.thinking}</p>
        ) : (
          <Blocks blocks={answer.blocks} shown={shown} typing={!done} />
        )}

        {done && (
          <>
            {answer.fallback && <WaitlistNote />}
            {answer.sources.length > 0 && (
              <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                {ask.sourcesLabel}:
                {answer.sources.map((source) => (
                  <span
                    key={source}
                    className="rounded-md border border-border bg-card px-1.5 py-0.5 font-medium text-foreground/80"
                  >
                    {source}
                  </span>
                ))}
              </p>
            )}
            <Actions exchange={exchange} />
            {latest && answer.followUps.length > 0 && (
              <ul className="flex flex-col items-start gap-1.5">
                {answer.followUps.map((question) => (
                  <li key={question}>
                    <button
                      type="button"
                      onClick={() => send(question)}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-left text-[13px] font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <CornerDownRightIcon
                        className="size-3.5 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
