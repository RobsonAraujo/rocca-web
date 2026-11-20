import { GraduationCapIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { suggestion } from "../data"

/**
 * The full reasoning behind the suggestion: each step with its source,
 * then what happens if you approve and a lesson. Shown on demand (the
 * desktop side panel, the phone "Why?" sheet), so the card stays short.
 */
export function SuggestionDetails({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <section>
        <h3 className="text-[13px] font-semibold">
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
                <p className="mt-1 text-xs text-muted-foreground">
                  Source: {step.source}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border pt-5">
        <h3 className="text-[13px] font-semibold">{suggestion.next.title}</h3>
        <ol className="mt-3 space-y-3">
          {suggestion.next.steps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-sm">
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center rounded-full border border-border text-xs font-semibold text-muted-foreground tabular-nums"
              >
                {index + 1}
              </span>
              <span className="pt-0.5 leading-snug text-pretty">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <ComingSoonButton
        variant="outline"
        className="h-10 w-full justify-start rounded-lg px-3 text-sm font-medium"
      >
        <GraduationCapIcon className="text-learn" aria-hidden />
        {suggestion.lesson}
      </ComingSoonButton>
    </div>
  )
}
