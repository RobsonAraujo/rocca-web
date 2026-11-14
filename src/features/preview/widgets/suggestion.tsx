import {
  CheckIcon,
  GraduationCapIcon,
  LockIcon,
  MessageCircleQuestionIcon,
  ReceiptIcon,
  XIcon,
} from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { panelClass } from "../components/panel"
import { toneClasses } from "../components/tone"
import { suggestion } from "../data"

function OrderLines() {
  const { order } = suggestion
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {order.title}
      </p>
      <ul className="mt-2 divide-y divide-border/70 text-sm">
        {order.lines.map((line) => (
          <li
            key={line.detail}
            className="flex items-center justify-between gap-3 py-2.5"
          >
            <span className="flex items-center gap-2.5">
              <span
                className={cn(
                  "inline-flex h-5 w-10 items-center justify-center rounded-md text-xs font-medium",
                  line.side === "Buy"
                    ? "bg-brand/10 text-brand"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {line.side}
              </span>
              <span className="font-medium">{line.detail}</span>
            </span>
            <span className="font-medium whitespace-nowrap tabular-nums">
              {line.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The page's main card: the one action that needs a decision. Amber marks it
 * as "needs you"; the big green Approve and the "nothing happens until you
 * approve" note make the control explicit; the timeline shows what follows.
 */
export function SuggestionWidget({ className }: { className?: string }) {
  const { taxSmart, order, next } = suggestion
  return (
    <Card
      id="suggestion"
      role="region"
      aria-labelledby="suggestion-title"
      // scroll-mt clears the sticky top bar (taller on phones: it holds the nav).
      className={cn(
        panelClass,
        "scroll-mt-36 border-t-4 border-t-attention ring-attention/30 lg:scroll-mt-24",
        className,
      )}
    >
      <CardHeader>
        <p
          className={cn(
            "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
            toneClasses.attention.tile,
          )}
        >
          <span className="size-1.5 rounded-full bg-attention" aria-hidden />
          {suggestion.eyebrow}
        </p>
        <h2
          id="suggestion-title"
          className="mt-2 text-xl font-semibold tracking-tight text-balance sm:text-2xl"
        >
          {suggestion.title}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">
          {suggestion.summary}
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-6 md:grid-cols-[1.15fr_1fr]">
          <div>
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {suggestion.reasoningTitle}
            </h3>
            <ol className="mt-3 space-y-4">
              {suggestion.reasoning.map((step, index) => (
                <li key={step.source} className="flex gap-3">
                  <span
                    aria-hidden
                    className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold tabular-nums"
                  >
                    {index + 1}
                  </span>
                  <div className="text-sm leading-relaxed">
                    <p>{step.text}</p>
                    <span className="mt-1.5 inline-flex rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Source: {step.source}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <OrderLines />
            <div className="flex items-start gap-3 rounded-xl bg-brand/[0.08] p-4 text-sm">
              <ReceiptIcon
                className="mt-0.5 size-4 shrink-0 text-brand"
                aria-hidden
              />
              <div>
                <p className="font-medium">
                  {taxSmart.label}: {taxSmart.account}
                </p>
                <p className="mt-0.5 text-muted-foreground">
                  <span className="font-semibold text-brand">
                    {taxSmart.estimate}
                  </span>{" "}
                  {taxSmart.comparison}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The decision: big, unmistakable, and nothing runs until you choose. */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-secondary/50 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <LockIcon className="size-4 shrink-0" aria-hidden />
            {suggestion.decisionNote}
          </p>
          <div className="flex gap-2">
            <ComingSoonButton
              className={cn(
                "h-11 flex-1 rounded-full px-6 text-sm sm:flex-none",
                toneClasses.brand.solid,
              )}
            >
              <CheckIcon aria-hidden />
              {order.approve}
            </ComingSoonButton>
            <ComingSoonButton
              variant="outline"
              className="h-11 flex-1 rounded-full bg-card px-5 text-sm sm:flex-none"
            >
              <XIcon aria-hidden />
              {order.dismiss}
            </ComingSoonButton>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {next.title}
          </h3>
          <ol className="mt-3 grid gap-3 sm:grid-cols-3">
            {next.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-2.5 text-sm">
                <span
                  aria-hidden
                  className="grid size-6 shrink-0 place-items-center rounded-full border border-brand/40 text-xs font-semibold text-brand tabular-nums"
                >
                  {index + 1}
                </span>
                <span className="leading-snug text-pretty">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          "flex-wrap justify-between gap-2",
          toneClasses.learn.soft,
        )}
      >
        <ComingSoonButton
          variant="link"
          className={cn(
            "h-auto justify-start p-0 text-left text-sm font-medium whitespace-normal",
            toneClasses.learn.text,
          )}
        >
          <GraduationCapIcon aria-hidden />
          {suggestion.lesson}
        </ComingSoonButton>
        <ComingSoonButton
          variant="ghost"
          size="sm"
          className="rounded-full text-muted-foreground"
        >
          <MessageCircleQuestionIcon aria-hidden />
          {suggestion.askWhy}
        </ComingSoonButton>
      </CardFooter>
    </Card>
  )
}
