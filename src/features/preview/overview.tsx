import { cn } from "@/lib/utils"
import type { Tone } from "@/components/product/tone"

import { AskRocca } from "./components/ask-rocca"
import { ModePill } from "./components/mode-pill"
import { PageHeader } from "./components/page-header"
import { sections, shell } from "./data"
import { AutonomyWidget } from "./widgets/autonomy"
import {
  MovesWidget,
  SavingsWidget,
  TrackRecordWidget,
} from "./widgets/insights"
import { LearnWidget } from "./widgets/learn"
import { PortfolioWidget } from "./widgets/portfolio"
import { SuggestionWidget } from "./widgets/suggestion"

/** A labeled band of the page; the dot repeats the zone's color. */
function Zone({
  label,
  tone,
  children,
}: {
  label: string
  tone: Tone
  children: React.ReactNode
}) {
  return (
    <section aria-label={label} className="space-y-3">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <span
          className={cn("size-2 rounded-full", {
            "bg-attention": tone === "attention",
            "bg-learn": tone === "learn",
            "bg-brand": tone === "brand",
            "bg-control": tone === "control",
          })}
          aria-hidden
        />
        {label}
      </p>
      {children}
    </section>
  )
}

/**
 * Overview page of the preview, shown right after a waitlist signup. All
 * data is simulated; every action shows a "coming soon" notice.
 *
 * Three zones, most important first:
 * 1. Needs your OK: the decision to make, beside how much Rocca handles.
 * 2. Learn & ask: lessons picked from your portfolio, and the chat.
 * 3. Your money: portfolio, what moved, savings, track record.
 * 4. In the news: headlines about what you own (a slot the page fills).
 */
export function Overview({ news }: { news?: React.ReactNode } = {}) {
  return (
    <>
      <PageHeader
        title={shell.greeting}
        subtitle={shell.subtitle}
        actions={<ModePill />}
      />

      <Zone label={sections.attention} tone="attention">
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          <SuggestionWidget className="lg:col-span-8" />
          <AutonomyWidget className="lg:col-span-4" />
        </div>
      </Zone>

      <Zone label={sections.learn} tone="learn">
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          <LearnWidget className="lg:col-span-5" />
          <AskRocca className="lg:col-span-7" />
        </div>
      </Zone>

      <Zone label={sections.money} tone="brand">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          <PortfolioWidget className="md:col-span-2 lg:col-span-8" />
          <MovesWidget className="lg:col-span-4" />
          <SavingsWidget className="lg:col-span-6" />
          <TrackRecordWidget className="md:col-span-2 lg:col-span-6" />
        </div>
      </Zone>

      {news && (
        <Zone label={sections.news} tone="brand">
          {news}
        </Zone>
      )}
    </>
  )
}
