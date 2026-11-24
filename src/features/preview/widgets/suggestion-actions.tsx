"use client"

import {
  CheckIcon,
  CircleCheckIcon,
  GraduationCapIcon,
  Loader2Icon,
  LockIcon,
  LockOpenIcon,
  ReceiptIcon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { OrderLines } from "@/components/product/order-lines"
import { toneClasses } from "@/components/product/tone"
import { cn } from "@/lib/utils"

import { demo, suggestion } from "../data"
import { WaitlistNote } from "../components/waitlist-note"
import { useDemo } from "../demo-state"
import { formatPercent } from "../format"
import { LessonButton, showAutopilot } from "../learn/open-lesson"

const percent = (fraction: number) => formatPercent(fraction, { digits: 0 })

/**
 * What the trade does, at a glance: NVDA's share now and after, against
 * your limit. The striped end is what gets sold; once the (simulated)
 * trade is done, the bar settles at the target.
 */
export function TrimPreview({ className }: { className?: string }) {
  const { suggestion: status } = useDemo()
  const { effect } = suggestion
  const done = status === "done"
  const width = (fraction: number) => `${(fraction / effect.scale) * 100}%`
  const label = done
    ? `${effect.label}: ${percent(effect.to)}, within ${effect.limitLabel.toLowerCase()} of ${percent(effect.limit)}.`
    : `${effect.label}: from ${percent(effect.from)} to ${percent(effect.to)}. ${effect.limitLabel}: ${percent(effect.limit)}.`
  return (
    <div role="img" aria-label={label} className={className}>
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="text-muted-foreground">{effect.label}</span>
        <span className="font-medium tabular-nums">
          {done
            ? percent(effect.to)
            : `${percent(effect.from)} → ${percent(effect.to)}`}
        </span>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-secondary">
        <span
          className="absolute inset-y-0 left-0 rounded-l-full bg-brand/70 transition-[border-radius] duration-300 data-[done=true]:rounded-r-full"
          data-done={done}
          style={{ width: width(effect.to) }}
        />
        {!done && (
          <span
            className="absolute inset-y-0 rounded-r-full bg-[repeating-linear-gradient(-45deg,var(--color-attention)_0_2px,transparent_2px_5px)] opacity-60"
            style={{
              left: width(effect.to),
              width: width(effect.from - effect.to),
            }}
          />
        )}
        <span
          className="absolute -top-1 h-4 w-0.5 -translate-x-1/2 rounded-full bg-foreground/60"
          style={{ left: width(effect.limit) }}
        />
      </div>
      <div className="relative mt-1.5 h-4 text-[11px] text-muted-foreground">
        <span
          className="absolute -translate-x-1/2 whitespace-nowrap"
          style={{ left: width(effect.limit) }}
        >
          {effect.limitLabel} {percent(effect.limit)}
        </span>
      </div>
    </div>
  )
}

/** The amber count beside "Needs your OK": shown while the decision waits. */
export function PendingCount() {
  const { suggestion: status } = useDemo()
  if (status !== "pending") return null
  return (
    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-attention px-1.5 text-[11px] font-semibold text-white tabular-nums">
      1
    </span>
  )
}

/** "Nothing happens until you approve", or the Autopilot version of it. */
export function DecisionNote({ className }: { className?: string }) {
  const { mode } = useDemo()
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <LockIcon className="size-4 shrink-0" aria-hidden />
      {mode === "autopilot"
        ? suggestion.autopilotNote
        : suggestion.decisionNote}
    </p>
  )
}

function ResetButton({ className }: { className?: string }) {
  const { reset } = useDemo()
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={reset}
      className={cn("rounded-lg bg-card px-3", className)}
    >
      <RotateCcwIcon aria-hidden />
      {demo.reset}
    </Button>
  )
}

function Placing() {
  return (
    <p className="flex items-center gap-2 text-sm font-medium">
      <Loader2Icon className="size-4 animate-spin text-brand" aria-hidden />
      {suggestion.placing}
    </p>
  )
}

/**
 * Under the receipt: earned autonomy. Approved after the lesson, the 12%
 * rule can go on Autopilot; approved without it, the lesson is one tap away.
 */
function Autonomy() {
  const { approvedInformed } = useDemo()
  const { receipt } = suggestion
  if (!approvedInformed) {
    return (
      <div className="flex flex-col items-start gap-2 rounded-lg bg-learn/[0.06] p-3">
        <p className="text-xs text-pretty">{receipt.learnToUnlock}</p>
        <LessonButton
          variant="outline"
          size="sm"
          className="rounded-lg bg-card px-3"
        >
          <GraduationCapIcon className="text-learn" aria-hidden />
          {receipt.learnCta}
        </LessonButton>
      </div>
    )
  }
  return (
    <div className="space-y-2 rounded-lg bg-control/[0.06] p-3">
      <p className="flex items-start gap-1.5 text-xs text-pretty">
        <GraduationCapIcon
          className="mt-px size-3.5 shrink-0 text-learn"
          aria-hidden
        />
        {receipt.informed}
      </p>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium">
        <LockOpenIcon className="size-3.5 shrink-0 text-control" aria-hidden />
        {receipt.unlockReady}
        <button
          type="button"
          onClick={showAutopilot}
          className="rounded-sm text-control underline-offset-2 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {receipt.unlockCta}
        </button>
      </p>
    </div>
  )
}

/** Simulated receipt: what Rocca would have done, and that it was fake. */
function Receipt() {
  const { order, taxSmart, receipt } = suggestion
  return (
    <div className="animate-in space-y-3 duration-300 fade-in slide-in-from-bottom-1">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
          <CheckIcon className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {receipt.eyebrow}
          </p>
          <p className="font-semibold">{receipt.title}</p>
        </div>
      </div>
      <OrderLines lines={order.lines} />
      <p className="flex items-start gap-1.5 text-xs">
        <ReceiptIcon
          className="mt-px size-3.5 shrink-0 text-brand"
          aria-hidden
        />
        <span>
          <span className="font-semibold text-brand">{taxSmart.estimate}</span>{" "}
          <span className="text-muted-foreground">
            in your {taxSmart.account} {taxSmart.comparison}
          </span>
        </span>
      </p>
      <p className="flex items-center gap-1.5 text-xs font-medium text-control">
        <CircleCheckIcon className="size-3.5 shrink-0" aria-hidden />
        {receipt.rule}
      </p>
      <Autonomy />
    </div>
  )
}

function Skipped() {
  return (
    <div className="animate-in duration-300 fade-in">
      <p className="font-semibold">{suggestion.skipped.title}</p>
      <p className="mt-0.5 text-sm text-pretty text-muted-foreground">
        {suggestion.skipped.description}
      </p>
    </div>
  )
}

/** After a decision: the outcome, the waitlist note and a way to replay. */
function Outcome({ className }: { className?: string }) {
  const { suggestion: status } = useDemo()
  return (
    <div className={cn("space-y-3", className)}>
      {status === "placing" && <Placing />}
      {status === "done" && <Receipt />}
      {status === "skipped" && <Skipped />}
      {status !== "placing" && (
        <div className="flex flex-col items-start gap-3 border-t border-border pt-3">
          <WaitlistNote />
          <ResetButton />
        </div>
      )}
    </div>
  )
}

/**
 * Desktop decision: Approve / Not now side by side, the "nothing happens
 * until you approve" note, then the simulated outcome in the same spot.
 * `aria-live` announces "placing" and the receipt.
 */
export function DecisionBar() {
  const { suggestion: status, approve, skip } = useDemo()
  const { order } = suggestion
  return (
    <div aria-live="polite">
      {status === "pending" ? (
        <>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Button
              type="button"
              onClick={approve}
              className={cn("h-10 rounded-lg text-sm", toneClasses.brand.solid)}
            >
              <CheckIcon aria-hidden />
              {order.approve}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={skip}
              className="h-10 rounded-lg bg-card px-4 text-sm"
            >
              {order.dismiss}
            </Button>
          </div>
          <DecisionNote className="mt-3 text-xs [&_svg]:size-3.5" />
        </>
      ) : (
        <Outcome />
      )}
    </div>
  )
}

/**
 * Phone version: big Approve, then Not now beside the Why? trigger (passed
 * in, since the sheet lives in the mobile home).
 */
export function MobileDecision({ why }: { why: React.ReactNode }) {
  const { suggestion: status, approve, skip } = useDemo()
  const { order } = suggestion
  return (
    <div aria-live="polite" className="mt-4">
      {status === "pending" ? (
        <>
          <Button
            type="button"
            onClick={approve}
            className={cn(
              "h-12 w-full rounded-2xl text-base",
              toneClasses.brand.solid,
            )}
          >
            <CheckIcon className="size-5" aria-hidden />
            {order.approve}
          </Button>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={skip}
              className="h-11 rounded-2xl bg-card text-sm"
            >
              <XIcon aria-hidden />
              {order.dismiss}
            </Button>
            {why}
          </div>
          <DecisionNote className="mt-3 justify-center text-xs [&_svg]:size-3.5" />
        </>
      ) : (
        <Outcome className="rounded-2xl bg-secondary/60 p-4" />
      )}
    </div>
  )
}
