/** Number formatting for the preview (US audience, so en-US and USD). */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

/** Typographic minus (U+2212): same width as "+", reads better in tables. */
const MINUS = "−"

const compactUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 0,
})

export function formatUsd(value: number) {
  return usd.format(value)
}

/** 248310 -> "$248K": chart axis labels. */
export function formatCompactUsd(value: number) {
  return compactUsd.format(value)
}

export function formatSignedUsd(value: number) {
  return `${value < 0 ? MINUS : "+"}${usd.format(Math.abs(value))}`
}

/** 0.183 -> "18.3%"; with `signed`, "+18.3%" or "−9.8%". */
export function formatPercent(
  fraction: number,
  { signed = false, digits = 1 }: { signed?: boolean; digits?: number } = {},
) {
  const text = `${(Math.abs(fraction) * 100).toFixed(digits)}%`
  if (fraction < 0) return `${MINUS}${text}`
  return signed ? `+${text}` : text
}
