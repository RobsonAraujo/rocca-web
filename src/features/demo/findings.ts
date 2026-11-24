import { savings } from "@/features/preview/data"
import { formatPercent } from "@/features/preview/format"
import {
  brokerageTaxLabel,
  nvdaShare,
  singleStockLimit,
} from "@/features/preview/learn/math"

const whole = (fraction: number) => formatPercent(fraction, { digits: 0 })

/**
 * The three things the first look shows, the ones no single broker can:
 * NVDA hiding inside funds, money leaking out, and the account a sale
 * should happen in. All derived from the preview's simulated portfolio.
 */
export const findings = {
  nvda: {
    total: whole(nvdaShare.total),
    direct: whole(nvdaShare.direct),
    viaFunds: formatPercent(nvdaShare.viaFunds),
    limit: whole(singleStockLimit),
  },
  savings: { total: savings.total, items: savings.items },
  tax: { roth: "$0", brokerage: brokerageTaxLabel },
} as const
