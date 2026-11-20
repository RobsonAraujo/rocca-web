"use client"

import { ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { HandleSheet, SheetTrigger, connectSheet } from "../mobile/sheet"
import { connectCopy } from "./data"

/**
 * Opens the connect sheet. A client wrapper, so server components can place
 * a trigger without passing the sheet handle across the boundary.
 */
export function ConnectTrigger({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <SheetTrigger handle={connectSheet} className={className}>
      {children}
    </SheetTrigger>
  )
}

/**
 * Simulated broker picker, split by what Rocca can do there: place trades,
 * or only read the account. Mounted once by the Portfolio page.
 */
export function ConnectSheet() {
  return (
    <HandleSheet
      handle={connectSheet}
      title={connectCopy.title}
      description={connectCopy.description}
    >
      <div className="space-y-6">
        {connectCopy.groups.map((group) => {
          const headingId = `connect-${group.access}`
          return (
            <section key={group.access} aria-labelledby={headingId}>
              <h3
                id={headingId}
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-2 rounded-full",
                    group.access === "trade"
                      ? "bg-brand"
                      : "bg-muted-foreground/40",
                  )}
                />
                {group.title}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {group.description}
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {group.institutions.map((name) => (
                  <li key={name}>
                    <ComingSoonButton
                      variant="outline"
                      className="h-11 w-full justify-between rounded-xl px-3 text-sm font-medium"
                    >
                      {name}
                      <ChevronRightIcon
                        className="text-muted-foreground"
                        aria-hidden
                      />
                    </ComingSoonButton>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {connectCopy.note}
        </p>
      </div>
    </HandleSheet>
  )
}
