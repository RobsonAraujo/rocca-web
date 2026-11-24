"use client"

import { CircleCheckIcon, SparklesIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { WelcomeKind } from "../constants"
import { welcome } from "../data"
import { useDemo } from "../demo-state"

/** Only the values the waitlist form and the demo links set are honored. */
export function parseWelcome(value: string | null): WelcomeKind | null {
  return value === "new" || value === "back" || value === "demo" ? value : null
}

/**
 * Greets visitors arriving from the waitlist form (`?welcome=new|back`),
 * from a "Try the demo" link (`?welcome=demo`, which also offers the
 * waitlist) or at the end of the recordable demo (the persona, by name).
 * Reads search params on the client, so the page stays static; render it
 * inside <Suspense> as the Next docs require for useSearchParams.
 */
export function WelcomeBanner() {
  const kind = parseWelcome(useSearchParams().get("welcome"))
  const { persona } = useDemo()
  const [dismissed, setDismissed] = useState(false)
  if ((!kind && !persona) || dismissed) return null

  const copy = persona
    ? {
        title: welcome.connected.title(persona.name, persona.accounts),
        description: welcome.connected.description,
      }
    : welcome[kind!]
  const isDemo = !persona && kind === "demo"
  const Icon = isDemo ? SparklesIcon : CircleCheckIcon
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand/[0.06] p-4 sm:items-center sm:gap-4 sm:p-5"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{copy.title}</p>
          <p className="mt-0.5 text-sm text-pretty text-muted-foreground">
            {copy.description}
          </p>
        </div>
        {isDemo && (
          <Link
            href={welcome.demo.ctaHref}
            className={cn(
              buttonVariants({ size: "lg" }),
              "self-start rounded-full px-4 sm:self-auto",
            )}
          >
            {welcome.demo.cta}
          </Link>
        )}
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
