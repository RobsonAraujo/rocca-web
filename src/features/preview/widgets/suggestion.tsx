import { ArrowRightIcon, MessageCircleQuestionIcon } from "lucide-react"

import { OrderLines } from "@/components/product/order-lines"
import { cn } from "@/lib/utils"

import { panelClass, panelLinkClass } from "../components/panel"
import { AskWhyButton } from "../components/ask-panel"
import {
  SidePanel,
  SidePanelTrigger,
  reasoningPanel,
} from "../components/side-panel"
import { accountAccess, suggestion } from "../data"
import { LessonPrompt } from "../learn/open-lesson"
import { DecisionBar, PendingCount, TrimPreview } from "./suggestion-actions"
import { SuggestionDetails } from "./suggestion-details"

/** What the order costs, which rule it serves, where it runs. */
function Impact() {
  const { taxSmart, impact } = suggestion
  const rows = [
    {
      label: impact.tax,
      value: (
        <>
          <span className="font-semibold text-brand">{taxSmart.estimate}</span>{" "}
          <span className="text-muted-foreground">{taxSmart.comparison}</span>
        </>
      ),
    },
    { label: impact.rule, value: impact.ruleValue },
    {
      label: impact.account,
      value: `${impact.accountValue} · ${accountAccess.trade}`,
    },
  ]
  return (
    <dl className="divide-y divide-border rounded-lg border border-border text-[13px]">
      {rows.map((row) => (
        <div key={row.label} className="flex gap-3 px-3 py-2">
          <dt className="w-16 shrink-0 text-muted-foreground">{row.label}</dt>
          <dd className="min-w-0 text-pretty">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * The one decision waiting for you, beside the portfolio: what Rocca
 * proposes, what it changes (NVDA 18% → 12%), what it costs and the
 * Approve / Not now choice. On a first run, a lesson comes before Approve
 * (learn why first). The reasoning
 * (steps and sources) opens in a side panel, so the card stays scannable.
 * The amber count is the only "needs you" color on the page.
 */
export function SuggestionWidget({ className }: { className?: string }) {
  const { order } = suggestion
  return (
    <section
      id="suggestion"
      aria-labelledby="suggestion-title"
      // scroll-mt clears the sticky top bar (taller on tablets: it holds the nav).
      className={cn(
        panelClass,
        "flex scroll-mt-36 flex-col p-5 lg:scroll-mt-24",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          {suggestion.needsOk}
          <PendingCount />
        </p>
        <p className="text-xs text-muted-foreground">{suggestion.eyebrow}</p>
      </div>

      <h2
        id="suggestion-title"
        className="mt-4 text-lg leading-snug font-semibold tracking-tight text-balance"
      >
        {suggestion.title}
      </h2>
      <p className="mt-1 text-[13px] leading-relaxed text-pretty text-muted-foreground">
        {suggestion.summary}
      </p>

      <TrimPreview className="mt-4" />

      <div className="mt-3">
        <p className="text-xs font-medium text-muted-foreground">
          {order.title}
        </p>
        <OrderLines lines={order.lines} className="mt-1" />
      </div>

      <div className="mt-2">
        <Impact />
      </div>

      <div className="mt-auto pt-5">
        <LessonPrompt className="mb-3" />
        <DecisionBar />
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <SidePanelTrigger handle={reasoningPanel} className={panelLinkClass}>
            {suggestion.review}
            <ArrowRightIcon className="size-3.5" aria-hidden />
          </SidePanelTrigger>
          <AskWhyButton
            className={cn(
              panelLinkClass,
              "text-muted-foreground hover:text-foreground",
            )}
          >
            <MessageCircleQuestionIcon className="size-3.5" aria-hidden />
            {suggestion.askWhy}
          </AskWhyButton>
        </div>
      </div>

      <SidePanel
        handle={reasoningPanel}
        title={suggestion.reviewTitle}
        description={suggestion.title}
      >
        <SuggestionDetails />
      </SidePanel>
    </section>
  )
}
