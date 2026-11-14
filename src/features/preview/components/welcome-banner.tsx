"use client"

import { CircleCheckIcon, XIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"

import type { WelcomeKind } from "../constants"
import { welcome } from "../data"

/** Only the two values the waitlist form sets are honored. */
export function parseWelcome(value: string | null): WelcomeKind | null {
  return value === "new" || value === "back" ? value : null
}

/**
 * Greets visitors arriving from the waitlist form (`?welcome=new|back`).
 * Reads search params on the client, so the page stays static; render it
 * inside <Suspense> as the Next docs require for useSearchParams.
 */
export function WelcomeBanner() {
  const kind = parseWelcome(useSearchParams().get("welcome"))
  const [dismissed, setDismissed] = useState(false)
  if (!kind || dismissed) return null

  const copy = welcome[kind]
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand/[0.06] p-4 sm:items-center sm:gap-4 sm:p-5"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
        <CircleCheckIcon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{copy.title}</p>
        <p className="mt-0.5 text-sm text-pretty text-muted-foreground">
          {copy.description}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={welcome.dismiss}
        onClick={() => setDismissed(true)}
      >
        <XIcon aria-hidden />
      </Button>
    </div>
  )
}
