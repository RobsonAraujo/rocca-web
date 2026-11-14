import { cn } from "@/lib/utils"

export type OrderLine = {
  side: "Buy" | "Sell"
  detail: string
  amount: string
}

/**
 * The Sell/Buy rows of a proposed order. Shared by the landing's hero
 * showcase and the dashboard's suggestion card so both read the same.
 */
export function OrderLines({
  lines,
  className,
}: {
  lines: readonly OrderLine[]
  className?: string
}) {
  return (
    <ul className={cn("divide-y divide-border/70 text-sm", className)}>
      {lines.map((line) => (
        <li
          key={line.detail}
          className="flex items-center justify-between gap-3 py-2.5"
        >
          <span className="flex items-center gap-2.5">
            <span
              className={cn(
                "inline-flex h-5 w-10 items-center justify-center rounded-md text-xs font-medium",
                line.side === "Buy"
                  ? "bg-brand/10 text-brand"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {line.side}
            </span>
            <span className="font-medium">{line.detail}</span>
          </span>
          <span className="font-medium whitespace-nowrap tabular-nums">
            {line.amount}
          </span>
        </li>
      ))}
    </ul>
  )
}
