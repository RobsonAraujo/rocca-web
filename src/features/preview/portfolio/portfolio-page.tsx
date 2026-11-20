import { PlusIcon, TrendingUpIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { preview } from "@/features/landing/content"
import { cn } from "@/lib/utils"

import { PageHeader } from "../components/page-header"
import { AccountsWidget } from "./accounts"
import { AllocationWidget } from "./allocation"
import { ConnectSheet, ConnectTrigger } from "./connect-sheet"
import { kpis, page } from "./data"
import { ExposureWidget } from "./exposure"
import { HoldingsWidget } from "./holdings"
import { InsightsWidget } from "./insights"
import { KpiStrip } from "./kpis"
import { viewClasses } from "./view-classes"
import { PortfolioViews } from "./views"

/** Phones: big total up top, like the Home screen. */
function MobilePortfolioHero() {
  return (
    <section aria-labelledby="m-portfolio-title" className="md:hidden">
      <h1 id="m-portfolio-title" className="text-sm text-muted-foreground">
        <span className="sr-only">{page.title}: </span>
        {kpis.value.label}
      </h1>
      <p className="mt-1 text-[2.5rem] leading-none font-semibold tracking-tight tabular-nums">
        {preview.portfolio.value}
      </p>
      <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-sm font-medium text-brand">
        <TrendingUpIcon className="size-4" aria-hidden />
        {kpis.value.hint}
      </p>
    </section>
  )
}

/**
 * Simulated Portfolio page: headline numbers, allocation vs targets,
 * look-through exposure and Rocca's insights, then accounts and holdings.
 * Phones get a hero and a segmented control instead of the page header.
 */
export function PortfolioPage() {
  return (
    <>
      <MobilePortfolioHero />
      <PageHeader
        className="max-md:hidden"
        title={page.title}
        subtitle={page.subtitle}
        actions={
          <ConnectTrigger
            className={cn(buttonVariants({ size: "sm" }), "rounded-full px-3")}
          >
            <PlusIcon aria-hidden />
            {page.connect}
          </ConnectTrigger>
        }
      />

      <KpiStrip />

      <PortfolioViews>
        {/* Desktop: allocation, exposure and accounts stacked beside the insights column. */}
        {/* Phones, Holdings view: everything in this grid is hidden, so drop the grid too (no stray gap). */}
        <div className="grid gap-4 max-md:in-data-[view=holdings]:hidden lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-6">
            <AllocationWidget className={viewClasses.overview} />
            <ExposureWidget className={viewClasses.overview} />
            <AccountsWidget className={viewClasses.accounts} />
          </div>
          <InsightsWidget className={`lg:col-span-5 ${viewClasses.overview}`} />
        </div>

        <HoldingsWidget className={viewClasses.holdings} />
      </PortfolioViews>

      {/* One sheet, two triggers: the header (desktop) and Accounts (phones). */}
      <ConnectSheet />
    </>
  )
}
