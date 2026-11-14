import {
  GraduationCapIcon,
  MessageCircleQuestionIcon,
  ReceiptIcon,
} from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { panelClass } from "../components/panel"
import { suggestion } from "../data"

/**
 * The agent's pending proposal: the differentiators in one place. Reasoning
 * with a source for every step, tax-aware account placement, and a lesson
 * for people who are new to the concept.
 */
export function SuggestionWidget({ className }: { className?: string }) {
  const { order, taxSmart } = suggestion
  return (
    <Card
      id="suggestion"
      role="region"
      aria-labelledby="suggestion-title"
      // scroll-mt clears the sticky top bar (taller on phones: it holds the nav).
      className={cn(
        panelClass,
        "scroll-mt-36 ring-brand/25 lg:scroll-mt-24",
        className,
      )}
    >
      <CardHeader>
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700">
          <span className="size-1.5 rounded-full bg-amber-500" aria-hidden />
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

      <CardContent className="grid gap-6 md:grid-cols-[1.15fr_1fr]">
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
                  <span className="mt-1.5 inline-flex rounded-md bg-brand/10 px-1.5 py-0.5 text-[11px] font-medium text-brand">
                    Source: {step.source}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-border p-4">
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

          <div className="flex items-start gap-3 rounded-xl bg-brand/[0.07] p-4 text-sm">
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

          <div className="grid grid-cols-2 gap-2">
            <ComingSoonButton className="h-10 rounded-full">
              {order.approve}
            </ComingSoonButton>
            <ComingSoonButton variant="outline" className="h-10 rounded-full">
              {order.dismiss}
            </ComingSoonButton>
          </div>
          <ComingSoonButton
            variant="ghost"
            className="h-9 rounded-full text-muted-foreground"
          >
            <MessageCircleQuestionIcon aria-hidden />
            {suggestion.askWhy}
          </ComingSoonButton>
        </div>
      </CardContent>

      <CardFooter className="gap-2 bg-secondary/50">
        <GraduationCapIcon className="size-4 shrink-0 text-brand" aria-hidden />
        <ComingSoonButton
          variant="link"
          className="h-auto p-0 text-sm font-medium whitespace-normal text-foreground"
        >
          {suggestion.lesson}
        </ComingSoonButton>
      </CardFooter>
    </Card>
  )
}
