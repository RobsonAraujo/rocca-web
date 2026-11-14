import { SparklesIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { preview } from "@/features/landing/content"

/** Static, decorative mock of the agent experience. Not interactive. */
export function ProductPreview() {
  return (
    <section aria-label="Product preview" className="px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card/60 p-2 shadow-2xl shadow-brand/5">
        <div className="grid gap-2 md:grid-cols-[1fr_1.4fr]">
          {/* Portfolio summary */}
          <div className="space-y-6 rounded-xl bg-background/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total portfolio</p>
              <Badge variant="outline" className="text-muted-foreground">
                {preview.label}
              </Badge>
            </div>
            <div>
              <p className="font-mono text-3xl font-semibold tracking-tight">
                {preview.portfolio.value}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-brand">
                <TrendingUpIcon className="size-4" aria-hidden />
                {preview.portfolio.change}
              </p>
            </div>
            <ul
              className="flex flex-wrap gap-2"
              aria-label="Connected accounts"
            >
              {preview.accounts.map((account) => (
                <li
                  key={account}
                  className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground"
                >
                  {account}
                </li>
              ))}
            </ul>
          </div>

          {/* Agent conversation */}
          <div className="space-y-3 rounded-xl bg-background/60 p-5">
            <p className="inline-flex items-center gap-2 text-sm font-medium">
              <span className="grid size-6 place-items-center rounded-md bg-brand/15 text-brand">
                <SparklesIcon className="size-3.5" aria-hidden />
              </span>
              Rocca
            </p>
            {preview.messages.map((message) => (
              <p
                key={message}
                className="rounded-xl rounded-tl-sm bg-secondary px-4 py-3 text-sm leading-relaxed"
              >
                {message}
              </p>
            ))}

            <div className="rounded-xl border border-border p-4">
              <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {preview.order.title}
              </p>
              <ul className="space-y-2 text-sm">
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
              {/* Visual-only buttons: rendered as spans so they are not focusable. */}
              <div className="mt-4 flex gap-2" aria-hidden>
                <span className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">
                  {preview.order.approve}
                </span>
                <span className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-border text-sm text-muted-foreground">
                  {preview.order.dismiss}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
