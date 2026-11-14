"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

import { mobile } from "../data"
import type { PortfolioView } from "./view-classes"

const views: PortfolioView[] = ["overview", "holdings", "accounts"]

/**
 * iOS-style segmented control for phones. It only switches which section is
 * visible (see view-classes.ts); the sections themselves are server
 * rendered. Hidden from md up, where every section shows at once.
 */
export function PortfolioViews({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<PortfolioView>("overview")
  return (
    // md:space-y-6 matches the page rhythm, so tablet and desktop look unchanged.
    <div data-view={view} className="space-y-4 md:space-y-6">
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 -mx-4 bg-background/85 px-4 py-2 backdrop-blur-xl md:hidden">
        <div
          role="group"
          aria-label={mobile.portfolioViews.label}
          className="grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1"
        >
          {views.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => setView(option)}
              className={cn(
                "h-9 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                view === option
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground",
              )}
            >
              {mobile.portfolioViews[option]}
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  )
}
