"use client"

import {
  ArrowRightIcon,
  PiggyBankIcon,
  ReceiptIcon,
  ScanSearchIcon,
} from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Tone } from "@/components/product/tone"
import { toneClasses } from "@/components/product/tone"
import { PREVIEW_PATH } from "@/features/preview/constants"
import { NvdaExposureBar } from "@/features/preview/learn/exposure-bar"
import { cn } from "@/lib/utils"

import { firstLook as copy } from "./content"
import { findings } from "./findings"
import { useDemoSession } from "./session"

function Finding({
  icon: Icon,
  tone,
  label,
  title,
  delay,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  tone: Tone
  label: string
  title: string
  /** Staggers the cards in, one after the other. */
  delay: string
  children: React.ReactNode
}) {
  return (
    <article
      className={cn(
        "flex animate-in flex-col rounded-2xl bg-card p-5 ring-1 ring-border duration-500 fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
        delay,
      )}
    >
      <p
        className={cn(
          "flex items-center gap-1.5 text-xs font-semibold",
          toneClasses[tone].text,
        )}
      >
        <Icon className="size-4" aria-hidden />
        {label}
      </p>
      <h2 className="mt-2 text-lg leading-snug font-semibold tracking-tight text-balance">
        {title}
      </h2>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </article>
  )
}

/**
 * Step 4: the first look, the "aha". Three things no single broker can
 * show, because each only sees its own account: NVDA hiding inside funds,
 * money leaking out, and how much the account a sale runs in matters.
 * "See your dashboard" ends the flow; the dashboard then plays the first
 * run (lesson before the decision, Autopilot earned rule by rule).
 */
export function FirstLook() {
  const { finish } = useDemoSession()
  const { nvda, savings, tax } = findings
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-medium text-muted-foreground">
        {copy.eyebrow}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {copy.title}
      </h1>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Finding
          icon={ScanSearchIcon}
          tone="attention"
          label={copy.nvda.label}
          title={copy.nvda.title(nvda.total)}
          delay="delay-100"
        >
          <p className="text-[13px] leading-relaxed text-pretty text-muted-foreground">
            {copy.nvda.body(nvda.direct, nvda.viaFunds, nvda.limit)}
          </p>
          <NvdaExposureBar labels={copy.nvda} className="mt-auto pt-5" />
        </Finding>

        <Finding
          icon={PiggyBankIcon}
          tone="brand"
          label={copy.savings.label}
          title={copy.savings.title(savings.total)}
          delay="delay-300"
        >
          <ul className="divide-y divide-border">
            {savings.items.map((item) => (
              <li
                key={item.label}
                className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-pretty text-muted-foreground">
                    {item.detail}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-brand tabular-nums">
                  {item.amount}
                </span>
              </li>
            ))}
          </ul>
        </Finding>

        <Finding
          icon={ReceiptIcon}
          tone="control"
          label={copy.tax.label}
          title={copy.tax.title(tax.brokerage)}
          delay="delay-500"
        >
          <p className="text-[13px] leading-relaxed text-pretty text-muted-foreground">
            {copy.tax.body(tax.brokerage)}
          </p>
          <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
            <div className={cn("rounded-xl p-3", toneClasses.brand.soft)}>
              <p className="text-xs text-muted-foreground">{copy.tax.roth}</p>
              <p className="mt-1 text-xl font-semibold text-brand tabular-nums">
                {tax.roth}
              </p>
            </div>
            <div className="rounded-xl p-3 ring-1 ring-border">
              <p className="text-xs text-muted-foreground">
                {copy.tax.brokerage}
              </p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {tax.brokerage}
              </p>
            </div>
          </div>
        </Finding>
      </div>

      <div className="mt-8 flex animate-in flex-col items-start gap-4 rounded-2xl bg-card p-5 ring-1 ring-border delay-700 duration-500 fill-mode-both fade-in motion-reduce:animate-none sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm font-medium">
          <span aria-hidden className="size-2 rounded-full bg-attention" />
          {copy.decision}
        </p>
        <Link
          href={PREVIEW_PATH}
          onClick={finish}
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 shrink-0 rounded-full px-5 text-sm",
          )}
        >
          {copy.cta}
          <ArrowRightIcon aria-hidden />
        </Link>
      </div>
    </div>
  )
}
