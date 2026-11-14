import { Suspense } from "react"

import { AskRocca } from "./components/ask-rocca"
import { PageHeader } from "./components/page-header"
import { WelcomeBanner } from "./components/welcome-banner"
import { shell } from "./data"
import { AutonomyWidget, RulesWidget } from "./widgets/autonomy"
import {
  MovesWidget,
  SavingsWidget,
  TrackRecordWidget,
} from "./widgets/insights"
import { LearnWidget } from "./widgets/learn"
import { PortfolioWidget } from "./widgets/portfolio"
import { SuggestionWidget } from "./widgets/suggestion"

/**
 * Overview page of the preview, shown right after a waitlist signup. All
 * data is simulated; every action shows a "coming soon" notice.
 *
 * Layout: two stacks plus a row of three on desktop, 2 columns on tablets,
 * 1 on phones.
 */
export function Overview() {
  return (
    <>
      {/* useSearchParams needs a Suspense boundary to keep the page static. */}
      <Suspense fallback={null}>
        <WelcomeBanner />
      </Suspense>

      <PageHeader title={shell.greeting} subtitle={shell.subtitle} />

      <AskRocca />

      {/*
       * Desktop: two independent stacks (8 + 4 columns) so tall and short
       * cards don't leave gaps, then a row of three. Below lg the stack
       * wrappers use `display: contents`, so their cards join the 1- or
       * 2-column grid directly.
       */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        <div className="contents lg:col-span-8 lg:flex lg:flex-col lg:gap-6">
          <PortfolioWidget className="md:col-span-2" />
          <SuggestionWidget className="md:col-span-2" />
        </div>
        <div className="contents lg:col-span-4 lg:flex lg:flex-col lg:gap-6">
          <AutonomyWidget />
          <RulesWidget />
          <LearnWidget />
        </div>
        <MovesWidget className="lg:col-span-4" />
        <SavingsWidget className="lg:col-span-4" />
        <TrackRecordWidget className="lg:col-span-4" />
      </div>
    </>
  )
}
