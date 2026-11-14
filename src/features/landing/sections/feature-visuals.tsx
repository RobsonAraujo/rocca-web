import { LogoMark } from "@/components/layout/logo"
import { illustrations, preview } from "@/features/landing/content"
import { cn } from "@/lib/utils"

/*
 * Small static product vignettes for the bento feature cards. Purely
 * decorative: the card's title and description carry the meaning, so the
 * card hides these from assistive tech.
 */

/**
 * Panels are size containers: on very small phones (< 17rem of content
 * width) secondary details drop out instead of colliding.
 */
const panel =
  "@container w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-soft"

/** Hidden when the panel is too narrow to show it beside the main label. */
const roomy = "hidden @[17rem]:inline"

/** One brand hue at decreasing strength: no extra colors in the palette. */
const tints = ["bg-brand", "bg-brand/65", "bg-brand/40", "bg-brand/20"]

export function AccountsVisual() {
  const { accounts } = illustrations
  return (
    <div className={panel}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs text-muted-foreground">Total portfolio</span>
        <span className="text-sm font-semibold tabular-nums">
          {preview.portfolio.value}
        </span>
      </div>
      <div className="mt-3 flex h-2 gap-0.5 overflow-hidden rounded-full">
        {accounts.map((account, index) => (
          <span
            key={account.name}
            className={tints[index]}
            style={{ width: `${account.share}%` }}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
        {accounts.map((account, index) => (
          <li
            key={account.name}
            className="flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className={cn("size-2 rounded-full", tints[index])} />
              {account.name}
            </span>
            <span className={cn("font-medium tabular-nums", roomy)}>
              {account.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MovesVisual() {
  const { moves } = illustrations
  return (
    <div className={panel}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs text-muted-foreground">{moves.title}</span>
        <span className={cn("text-xs font-medium text-brand", roomy)}>
          {preview.portfolio.change}
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {moves.items.map((move) => (
          <li
            key={move.symbol}
            className="grid grid-cols-[2.75rem_1fr_auto] items-center gap-3 text-xs"
          >
            <span className="font-medium">{move.symbol}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-brand"
                style={{ width: `${move.share}%` }}
              />
            </span>
            <span className="font-medium tabular-nums">{move.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ApprovalVisual() {
  const { approval } = illustrations
  return (
    <div className={panel}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{approval.title}</p>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand" />
          {approval.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{approval.detail}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <span className="inline-flex h-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {preview.order.approve}
        </span>
        <span className="inline-flex h-8 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground">
          {preview.order.dismiss}
        </span>
      </div>
    </div>
  )
}

type Alert = (typeof illustrations.alerts)[number]

function AlertRow({ alert, className }: { alert: Alert; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-card p-3 shadow-soft",
        className,
      )}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand">
        <LogoMark className="size-4 text-brand-foreground" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">{alert.title}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {alert.detail}
        </p>
      </div>
      <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
        {alert.time}
      </span>
    </div>
  )
}

export function AlertsVisual() {
  const [latest, earlier] = illustrations.alerts
  return (
    <div className="w-full max-w-sm space-y-2">
      <AlertRow alert={latest} />
      {/* The older alert recedes, suggesting a notification stack. */}
      <AlertRow alert={earlier} className="mx-3 opacity-60" />
    </div>
  )
}
