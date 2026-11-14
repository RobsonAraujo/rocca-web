import { ScanSearchIcon } from "lucide-react"

import { Panel } from "../components/panel"
import { formatPercent } from "../format"
import { exposure } from "./data"

/**
 * Look-through view: stocks you hold directly plus the slice of them inside
 * your funds. Bars are scaled to the largest total so NVDA fills the track.
 */
export function ExposureWidget({ className }: { className?: string }) {
  const max = Math.max(...exposure.items.map((i) => i.direct + i.viaFunds))
  return (
    <Panel
      id="exposure"
      title={exposure.title}
      description={exposure.description}
      icon={ScanSearchIcon}
      className={className}
    >
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-brand" aria-hidden />
          {exposure.legend.direct}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-brand/35" aria-hidden />
          {exposure.legend.viaFunds}
        </span>
      </div>

      <ul className="mt-4 space-y-3.5">
        {exposure.items.map(({ symbol, direct, viaFunds }) => (
          <li
            key={symbol}
            className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 text-sm"
          >
            <span className="font-medium">{symbol}</span>
            <span
              className="flex h-2.5 overflow-hidden rounded-full bg-secondary"
              role="img"
              aria-label={`${formatPercent(direct)} directly, ${formatPercent(viaFunds)} through funds`}
            >
              <span
                className="h-full bg-brand"
                style={{ width: `${(direct / max) * 100}%` }}
              />
              <span
                className="h-full bg-brand/35"
                style={{ width: `${(viaFunds / max) * 100}%` }}
              />
            </span>
            <span className="w-14 text-right font-semibold tabular-nums">
              {formatPercent(direct + viaFunds)}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
