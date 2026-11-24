import { preview } from "@/features/landing/content"

import { suggestion } from "../data"
import {
  exposure,
  holdingValue,
  holdings,
  portfolioTotal,
} from "../portfolio/data"

/**
 * The numbers behind the Concentration lesson and the demo's first look,
 * derived from the simulated portfolio so they can't drift from the rest of
 * the preview (tests pin the results).
 */

const nvda = holdings.find((h) => h.symbol === "NVDA")!
const nvdaExposure = exposure.items.find((item) => item.symbol === "NVDA")!

/** Your single-stock limit (the 12% rule). */
export const singleStockLimit = suggestion.effect.limit

/** NVDA's share of all your money: held directly, inside funds, and both. */
export const nvdaShare = {
  direct: nvdaExposure.direct,
  viaFunds: nvdaExposure.viaFunds,
  total: nvdaExposure.direct + nvdaExposure.viaFunds,
}

/** Dollars in NVDA you hold directly, per account and in total. */
export const nvdaPositions = nvda.positions
export const nvdaDirectValue = holdingValue(nvda)

/** Dollars of NVDA inside your funds. */
export const nvdaFundsValue = nvdaShare.viaFunds * portfolioTotal

/** What you'd own directly with NVDA trimmed to your limit. */
export const nvdaDirectAtLimit = singleStockLimit * portfolioTotal

/**
 * What a drop in NVDA would cost you today: it hits what you own directly
 * and what your funds hold.
 */
export function lossIfDrop(drop: number, directValue = nvdaDirectValue) {
  return (directValue + nvdaFundsValue) * drop
}

/** "$14,868" -> 14868. */
export function parseUsd(text: string) {
  return Number(text.replace(/[^0-9.]/g, ""))
}

/** The part of a sale that is gain, for a position up by `gain` (0.519 = +51.9%). */
export function saleGain(amount: number, gain: number) {
  return amount - amount / (1 + gain)
}

/** The long-term capital gains rate the tax estimates assume. */
export const LONG_TERM_RATE = 0.15

/** The NVDA sale in the suggested trim. */
export const nvdaSale = parseUsd(preview.order.lines[0].amount)

/** Gain in that sale, and the tax it would owe in a taxable account. */
export const nvdaSaleGain = saleGain(nvdaSale, nvda.gain!)
export const nvdaSaleTax = nvdaSaleGain * LONG_TERM_RATE

/** "~$765", as the landing and the decision card say it. */
export const brokerageTaxLabel =
  preview.order.taxSmart.comparison.match(/~?\$[\d,]+/)?.[0] ?? ""
