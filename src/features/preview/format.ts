/** Number formatting for the preview (US audience, so en-US and USD). */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

/** Typographic minus (U+2212): same width as "+", reads better in tables. */
const MINUS = "−"

export function formatUsd(value: number) {
  return usd.format(value)
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
