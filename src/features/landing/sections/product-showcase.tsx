import { CheckIcon, ReceiptIcon, TrendingUpIcon, XIcon } from "lucide-react"

import { LogoMark } from "@/components/layout/logo"
import { OrderLines } from "@/components/product/order-lines"
import { toneClasses } from "@/components/product/tone"
import { Badge } from "@/components/ui/badge"
import { preview } from "@/features/landing/content"
import { cn } from "@/lib/utils"

/** A gently rising week for the portfolio card (viewBox 0 0 120 32). */
const SPARKLINE = "0,26 13,24 26,27 40,19 53,21 66,14 80,16 93,9 106,10 120,4"

/** Static, decorative mock of the agent conversation. Not interactive. */
export function ProductShowcase() {
  const { order } = preview
  return (
    <div
      aria-label="Simulated preview: Rocca suggests rebalancing an oversized NVDA position and waits for your approval."
      role="img"
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <div className="rounded-3xl border border-border bg-card p-5 shadow-float sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2.5 text-sm font-medium">
            <span className="grid size-8 place-items-center rounded-full bg-brand">
              <LogoMark className="size-4.5 text-brand-foreground" />
            </span>
            Rocca
            <span className="font-normal text-muted-foreground">· now</span>
          </p>
          <Badge variant="outline" className="text-muted-foreground">
            {preview.label}
          </Badge>
        </div>

        <div className="mt-5 space-y-2.5">
          {preview.messages.map((message) => (
            <p
              key={message}
              className="max-w-[94%] rounded-2xl rounded-tl-md bg-secondary px-4 py-3 text-sm leading-relaxed"
            >
              {message}
            </p>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-border p-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {order.title}
          </p>
          <OrderLines lines={order.lines} className="mt-2" />
          {/* Tax-smart placement: same detail the dashboard preview shows. */}
          {/* The amount never wraps; the explanation can. */}
          <p className="mt-1 flex items-start gap-1.5 rounded-lg bg-brand/[0.08] px-3 py-2 text-xs">
            <ReceiptIcon
              className="mt-px size-3.5 shrink-0 text-brand"
              aria-hidden
            />
            <span className="shrink-0 font-semibold whitespace-nowrap text-brand">
              {order.taxSmart.estimate}
            </span>
            <span className="text-pretty text-muted-foreground">
              in your {order.taxSmart.account} {order.taxSmart.comparison}
            </span>
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <span
              className={cn(
                "inline-flex h-9 items-center justify-center gap-1.5 rounded-full text-sm font-medium",
                toneClasses.brand.solid,
              )}
            >
              <CheckIcon className="size-4" aria-hidden />
              {order.approve}
            </span>
            <span className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border bg-card text-sm font-medium text-muted-foreground">
              <XIcon className="size-4" aria-hidden />
              {order.dismiss}
            </span>
          </div>
        </div>
      </div>

      {/*
       * Floating portfolio card (tablet/desktop only). Kept compact and hung
       * low so it only overlaps the chat card's bottom padding, never the
       * Approve / Not now actions.
       */}
      <div className="absolute -bottom-16 -left-4 hidden w-72 items-center gap-4 rounded-2xl border border-border bg-card px-4 py-3 shadow-float sm:flex lg:-left-12">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Total portfolio</p>
          <p className="mt-0.5 text-lg font-semibold tracking-tight tabular-nums">
            {preview.portfolio.value}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-brand">
            <TrendingUpIcon className="size-3.5" aria-hidden />
            {preview.portfolio.change}
          </p>
        </div>
        <svg
          viewBox="0 0 120 32"
          preserveAspectRatio="none"
          className="h-10 w-20 shrink-0 text-brand"
          aria-hidden
        >
          <polygon
            points={`${SPARKLINE} 120,32 0,32`}
            fill="currentColor"
            fillOpacity={0.08}
          />
          <polyline
            points={SPARKLINE}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  )
}
