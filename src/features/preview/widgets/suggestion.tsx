import {
  GraduationCapIcon,
  MessageCircleQuestionIcon,
  ReceiptIcon,
} from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { OrderLines } from "@/components/product/order-lines"
import { toneClasses } from "@/components/product/tone"

import { ComingSoonButton } from "../components/coming-soon"
import { panelClass } from "../components/panel"
import { suggestion } from "../data"
import { DecisionBar } from "./suggestion-actions"

/** Proposed order: shared Sell/Buy rows inside a titled box. */
function OrderBox() {
  const { order } = suggestion
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {order.title}
      </p>
      <OrderLines lines={order.lines} className="mt-2" />
    </div>
  )
}

/**
 * The page's main card: the one action that needs a decision. Amber marks it
 * as "needs you"; the big green Approve and the "nothing happens until you
 * approve" note make the control explicit; the timeline shows what follows.
 */
export function SuggestionWidget({ className }: { className?: string }) {
  const { taxSmart, next } = suggestion
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
            <OrderBox />
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
        <DecisionBar />

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
