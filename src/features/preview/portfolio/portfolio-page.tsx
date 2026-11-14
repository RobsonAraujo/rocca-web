import { DownloadIcon, PlusIcon } from "lucide-react"

import { ComingSoonButton } from "../components/coming-soon"
import { PageHeader } from "../components/page-header"
import { AccountsWidget } from "./accounts"
import { AllocationWidget } from "./allocation"
import { page } from "./data"
import { ExposureWidget } from "./exposure"
import { HoldingsWidget } from "./holdings"
import { InsightsWidget } from "./insights"
import { KpiStrip } from "./kpis"

/**
 * Simulated Portfolio page: headline numbers, allocation vs targets,
 * look-through exposure and Rocca's insights, then accounts and holdings.
 */
export function PortfolioPage() {
  return (
    <>
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
        actions={
          <>
            <ComingSoonButton
              variant="outline"
              size="sm"
              className="rounded-full bg-card px-3"
            >
              <DownloadIcon aria-hidden />
              {page.export}
            </ComingSoonButton>
            <ComingSoonButton size="sm" className="rounded-full px-3">
              <PlusIcon aria-hidden />
              {page.connect}
            </ComingSoonButton>
          </>
        }
      />

      <KpiStrip />

      {/* Desktop: allocation, exposure and accounts stacked beside the insights column. */}
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-6">
          <AllocationWidget />
          <ExposureWidget />
          <AccountsWidget />
        </div>
        <InsightsWidget className="lg:col-span-5" />
      </div>

      <HoldingsWidget />
    </>
  )
}
