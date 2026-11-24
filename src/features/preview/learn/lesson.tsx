"use client"

import { Drawer } from "@base-ui/react/drawer"
import { CircleCheckIcon, LockOpenIcon } from "lucide-react"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { OrderLines } from "@/components/product/order-lines"
import { toneClasses } from "@/components/product/tone"
import { illustrations, preview } from "@/features/landing/content"
import { cn } from "@/lib/utils"

import { suggestion } from "../data"
import { useDemo } from "../demo-state"
import { formatPercent, formatUsd } from "../format"
import { portfolioTotal } from "../portfolio/data"
import { LESSON_ID, lesson } from "./data"
import { NvdaExposureBar } from "./exposure-bar"
import {
  brokerageTaxLabel,
  lossIfDrop,
  nvdaDirectAtLimit,
  nvdaPositions,
  nvdaSaleGain,
} from "./math"

const { steps } = lesson
const order = ["exposure", "whatIf", "rebalance", "tax", "check"] as const
type StepId = (typeof order)[number]

/** Slider range for "What if NVDA drops?", in percent. */
export const DROP = { min: 10, max: 50, step: 5, initial: 30 } as const

const institutionOf = (account: string) =>
  illustrations.accounts.find((a) => a.name === account)?.institution ?? account

function StepTitle({ children }: { children: string }) {
  return (
    <h3 className="text-lg leading-snug font-semibold tracking-tight text-balance">
      {children}
    </h3>
  )
}

function Body({ children }: { children: string }) {
  return (
    <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
      {children}
    </p>
  )
}

function Exposure() {
  const copy = steps.exposure
  const brokers = Object.entries(nvdaPositions)
  return (
    <div className="space-y-4">
      <StepTitle>{copy.title}</StepTitle>
      {/* The term first, then what it means for your money. */}
      <p className="rounded-r-lg border-l-2 border-learn bg-learn/[0.06] px-3 py-2.5 text-[13px] leading-relaxed text-pretty">
        {copy.definition}
      </p>
      <Body>{copy.body}</Body>
      <NvdaExposureBar labels={copy} className="pt-1" />
      <div className="rounded-lg bg-secondary/60 p-3 text-[13px]">
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {brokers.map(([account, value]) => (
            <li key={account}>
              <span className="text-muted-foreground">
                {institutionOf(account)}:
              </span>{" "}
              <span className="font-medium tabular-nums">
                {formatUsd(value ?? 0)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-xs text-pretty text-muted-foreground">
          {copy.brokers}
        </p>
      </div>
    </div>
  )
}

function WhatIf() {
  const copy = steps.whatIf
  const [drop, setDrop] = useState<number>(DROP.initial)
  const sliderId = useId()
  const loss = lossIfDrop(drop / 100)
  const atLimit = lossIfDrop(drop / 100, nvdaDirectAtLimit)
  return (
    <div className="space-y-4">
      <StepTitle>{copy.title}</StepTitle>
      <Body>{copy.body}</Body>
      <div className="rounded-lg border border-border p-4">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={sliderId} className="text-[13px] font-medium">
            {copy.slider}
          </label>
          <span className="text-sm font-semibold tabular-nums">−{drop}%</span>
        </div>
        <input
          id={sliderId}
          type="range"
          min={DROP.min}
          max={DROP.max}
          step={DROP.step}
          value={drop}
          onChange={(event) => setDrop(Number(event.target.value))}
          aria-valuetext={`${drop}%`}
          className="mt-3 w-full accent-learn"
        />
        <div aria-live="polite" className="mt-4 space-y-3">
          <p>
            <span className="block text-xs text-muted-foreground">
              {copy.youLose}
            </span>
            <span className="text-2xl font-semibold tracking-tight text-attention tabular-nums">
              {formatUsd(loss)}
            </span>{" "}
            <span className="text-xs text-muted-foreground">
              · {formatPercent(loss / portfolioTotal)} {copy.ofEverything}
            </span>
          </p>
          <p className="flex items-baseline justify-between gap-3 border-t border-border pt-3 text-[13px]">
            <span className="text-muted-foreground">{copy.atLimit}</span>
            <span className="font-semibold tabular-nums">
              {formatUsd(atLimit)}
            </span>
          </p>
        </div>
      </div>
      <Body>{copy.takeaway}</Body>
    </div>
  )
}

function Rebalance() {
  const copy = steps.rebalance
  const { effect } = suggestion
  const rows = [
    { label: copy.before, share: effect.from, className: "bg-attention/70" },
    { label: copy.after, share: effect.to, className: "bg-brand/70" },
  ]
  return (
    <div className="space-y-4">
      <StepTitle>{copy.title}</StepTitle>
      <Body>{copy.body}</Body>
      <OrderLines lines={preview.order.lines} />
      <ul className="space-y-2.5 text-[13px]">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="h-2 overflow-hidden rounded-full bg-secondary">
              <span
                className={cn("block h-full rounded-full", row.className)}
                style={{ width: `${(row.share / effect.scale) * 100}%` }}
              />
            </span>
            <span className="font-medium tabular-nums">
              {formatPercent(row.share, { digits: 0 })}
            </span>
          </li>
        ))}
      </ul>
      <Body>{copy.takeaway}</Body>
    </div>
  )
}

function Tax() {
  const copy = steps.tax
  // "about $5,100": the gain, to the nearest hundred, so it reads as an estimate.
  const gain = formatUsd(Math.round(nvdaSaleGain / 100) * 100)
  return (
    <div className="space-y-4">
      <StepTitle>{copy.title}</StepTitle>
      <Body>{copy.body}</Body>
      <div className="grid grid-cols-2 gap-2">
        <div className={cn("rounded-lg p-3 ring-1", toneClasses.brand.soft)}>
          <p className="text-xs text-muted-foreground">{copy.roth}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-brand tabular-nums">
            $0
          </p>
          <p className="mt-1 text-xs text-pretty text-muted-foreground">
            {copy.rothNote}
          </p>
        </div>
        <div className="rounded-lg p-3 ring-1 ring-border">
          <p className="text-xs text-muted-foreground">{copy.brokerage}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
            {brokerageTaxLabel}
          </p>
          <p className="mt-1 text-xs text-pretty text-muted-foreground">
            {copy.brokerageNote(gain)}
          </p>
        </div>
      </div>
      <Body>{copy.takeaway}</Body>
      <p className="text-xs text-muted-foreground">{copy.assumption}</p>
    </div>
  )
}

function Check({ onLearned }: { onLearned: () => void }) {
  const copy = steps.check
  const [answer, setAnswer] = useState<string | null>(null)
  const picked = copy.options.find((option) => option.id === answer)
  const correct = picked !== undefined && "correct" in picked
  const questionId = useId()
  return (
    <div className="space-y-4">
      <StepTitle>{copy.title}</StepTitle>
      <p id={questionId} className="text-sm leading-relaxed text-pretty">
        {copy.question}
      </p>
      <ul aria-labelledby={questionId} className="space-y-2">
        {copy.options.map((option) => {
          const chosen = option.id === answer
          const right = "correct" in option
          return (
            <li key={option.id}>
              <button
                type="button"
                aria-pressed={chosen}
                disabled={correct}
                onClick={() => {
                  setAnswer(option.id)
                  if (right) onLearned()
                }}
                className={cn(
                  "w-full rounded-lg border px-3 py-2.5 text-left text-sm text-pretty transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default",
                  chosen && right
                    ? "border-brand bg-brand/[0.06] font-medium"
                    : chosen
                      ? "border-attention/50 bg-attention/[0.06]"
                      : "border-border hover:bg-muted disabled:opacity-60 disabled:hover:bg-transparent",
                )}
              >
                {option.label}
              </button>
            </li>
          )
        })}
      </ul>
      <div aria-live="polite">
        {picked && (
          <p
            className={cn(
              "text-[13px] text-pretty",
              correct ? "font-medium text-brand" : "text-attention",
            )}
          >
            {picked.feedback}
          </p>
        )}
        {correct && (
          <div
            className={cn(
              "mt-4 animate-in space-y-2 rounded-lg p-4 ring-1 duration-300 fade-in slide-in-from-bottom-1",
              toneClasses.learn.soft,
              toneClasses.learn.ring,
            )}
          >
            <p
              className={cn(
                "flex items-center gap-2 font-semibold",
                toneClasses.learn.text,
              )}
            >
              <CircleCheckIcon className="size-5 shrink-0" aria-hidden />
              {copy.learned}
            </p>
            <p className="flex items-start gap-2 text-[13px] text-pretty text-muted-foreground">
              <LockOpenIcon
                className="mt-0.5 size-4 shrink-0 text-control"
                aria-hidden
              />
              {copy.unlock}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function StepView({ id, onLearned }: { id: StepId; onLearned: () => void }) {
  switch (id) {
    case "exposure":
      return <Exposure />
    case "whatIf":
      return <WhatIf />
    case "rebalance":
      return <Rebalance />
    case "tax":
      return <Tax />
    case "check":
      return <Check onLearned={onLearned} />
  }
}

/**
 * The Concentration lesson, built from the simulated portfolio: what you
 * really own in NVDA, what a drop would cost, how rebalancing fixes it,
 * why the account matters, then a quick check. Answering it right marks
 * the concept learned, which is what unlocks Autopilot for the 12% rule.
 * Rendered inside a drawer (side panel or sheet), so "Back to the
 * decision" is that drawer's close.
 */
export function ConcentrationLesson() {
  const { learned, completeLesson } = useDemo()
  const [index, setIndex] = useState(0)
  const id = order[index]!
  const last = index === order.length - 1
  const learnedNow = learned.includes(LESSON_ID)

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center gap-3">
        <p className="shrink-0 text-xs font-medium text-muted-foreground">
          {lesson.stepOf(index + 1, order.length)}
        </p>
        <div aria-hidden className="flex flex-1 gap-1">
          {order.map((step, i) => (
            <span
              key={step}
              className={cn(
                "h-1 flex-1 rounded-full",
                i <= index ? "bg-learn" : "bg-secondary",
              )}
            />
          ))}
        </div>
      </div>

      <div
        key={id}
        className="mt-5 flex-1 animate-in duration-200 fade-in motion-reduce:animate-none"
      >
        <StepView id={id} onLearned={() => completeLesson(LESSON_ID)} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="ghost"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
          className="rounded-lg"
        >
          {lesson.back}
        </Button>
        {!last ? (
          <Button
            type="button"
            onClick={() => setIndex(index + 1)}
            className={cn("h-9 rounded-lg px-4", toneClasses.learn.solid)}
          >
            {lesson.next}
          </Button>
        ) : (
          learnedNow && (
            <Drawer.Close
              render={
                <Button
                  type="button"
                  className={cn("h-9 rounded-lg px-4", toneClasses.brand.solid)}
                />
              }
            >
              {lesson.close}
            </Drawer.Close>
          )
        )}
      </div>
    </div>
  )
}
