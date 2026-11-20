import { ModePill } from "./components/mode-pill"
import { PageHeader } from "./components/page-header"
import { shell } from "./data"
import { AutonomyWidget } from "./widgets/autonomy"
import {
  MovesWidget,
  SavingsWidget,
  TrackRecordWidget,
} from "./widgets/insights"
import { LearnWidget } from "./widgets/learn"
import { PortfolioHero } from "./widgets/portfolio"
import { SuggestionWidget } from "./widgets/suggestion"

/**
 * Overview page of the preview, shown right after a waitlist signup. All
 * data is simulated; every action shows a "coming soon" notice.
 *
 * Laid out the way investing dashboards are, most important first:
 * 1. The total and its chart, beside the one decision that needs you.
 * 2. How much Rocca handles (and its rules), beside what moved, money to
 *    keep and Rocca's track record (the column matches its height).
 * 3. In the news: live headlines about what you own (a slot the page fills).
 * 4. The lessons, as a full-width strip.
 * The chat isn't a card: Ask Rocca opens from the top bar on every page.
 */
export function Overview({ news }: { news?: React.ReactNode } = {}) {
  return (
    <>
      <PageHeader
        title={shell.greeting}
        subtitle={shell.subtitle}
        actions={<ModePill />}
      />

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        <PortfolioHero className="lg:col-span-8" />
        <SuggestionWidget className="lg:col-span-4" />
      </div>

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        <AutonomyWidget className="lg:col-span-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:col-span-8 lg:gap-5">
          <MovesWidget />
          <SavingsWidget />
          <TrackRecordWidget className="md:col-span-2" />
        </div>
      </div>

      {news}

      <LearnWidget />
    </>
  )
}
