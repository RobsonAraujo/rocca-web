import { SparklesIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { preview } from "@/features/landing/content"

/** Static, decorative mock of the agent conversation. Not interactive. */
export function ProductShowcase() {
  return (
    <div
      aria-label="Simulated preview: Rocca suggests rebalancing an oversized NVDA position and waits for your approval."
      role="img"
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-[0_24px_60px_-24px_oklch(0.2_0.02_260/0.25)] sm:p-6">
        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-2 text-sm font-medium">
            <span className="grid size-7 place-items-center rounded-full bg-brand text-brand-foreground">
              <SparklesIcon className="size-3.5" aria-hidden />
            </span>
            Rocca
            <span className="font-normal text-muted-foreground">· now</span>
          </p>
          <Badge variant="outline" className="text-muted-foreground">
            {preview.label}
          </Badge>
        </div>

        <div className="mt-5 space-y-3">
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
            {preview.order.title}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {preview.order.lines.map((line) => (
              <li
                key={line.detail}
                className="flex items-center justify-between"
              >
                <span>
                  <span
                    className={
                      line.side === "Buy"
                        ? "text-brand"
                        : "text-muted-foreground"
                    }
                  >
                    {line.side}
                  </span>{" "}
                  {line.detail}
                </span>
                <span className="font-mono text-muted-foreground">
                  {line.amount}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <span className="inline-flex h-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {preview.order.approve}
            </span>
            <span className="inline-flex h-9 items-center justify-center rounded-full border border-border text-sm text-muted-foreground">
              {preview.order.dismiss}
            </span>
          </div>
        </div>
      </div>

      {/* Floating portfolio card (desktop/tablet only), hanging below the chat card. */}
      <div className="absolute -bottom-20 -left-4 hidden w-56 rounded-2xl border border-border bg-card p-4 shadow-xl sm:block lg:-left-10">
        <p className="text-xs text-muted-foreground">Total portfolio</p>
        <p className="mt-1 font-mono text-xl font-semibold tracking-tight">
          {preview.portfolio.value}
        </p>
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-brand">
          <TrendingUpIcon className="size-3.5" aria-hidden />
          {preview.portfolio.change}
        </p>
      </div>
    </div>
  )
}
