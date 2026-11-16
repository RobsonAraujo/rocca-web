"use client"

import {
  CheckIcon,
  CircleCheckIcon,
  Loader2Icon,
  LockIcon,
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
      className={cn("rounded-full bg-card px-3", className)}
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
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
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
        <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
          <WaitlistNote />
          <ResetButton className="self-start sm:self-auto" />
        </div>
      )}
    </div>
  )
}

/**
 * Desktop decision bar: Approve / Not now, then the simulated outcome in the
 * same spot. `aria-live` announces "placing" and the receipt.
 */
export function DecisionBar() {
  const { suggestion: status, approve, skip } = useDemo()
  const { order } = suggestion
  return (
    <div
      aria-live="polite"
      className="rounded-2xl border border-border bg-secondary/50 p-3 sm:p-4"
    >
      {status === "pending" ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <DecisionNote />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={approve}
              className={cn(
                "h-11 flex-1 rounded-full px-6 text-sm sm:flex-none",
                toneClasses.brand.solid,
              )}
            >
              <CheckIcon aria-hidden />
              {order.approve}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={skip}
              className="h-11 flex-1 rounded-full bg-card px-5 text-sm sm:flex-none"
            >
              <XIcon aria-hidden />
              {order.dismiss}
            </Button>
          </div>
        </div>
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
