/**
 * Phones show one Portfolio section at a time, picked with the segmented
 * control (PortfolioViews sets data-view on a wrapper). Each widget gets the
 * class for its section: hidden below md unless its view is active. From md
 * up these classes do nothing, so tablet and desktop show every section.
 *
 * Full class names on purpose: Tailwind only sees literal strings.
 */
export type PortfolioView = "overview" | "holdings" | "accounts"

export const viewClasses: Record<PortfolioView, string> = {
  overview: "max-md:hidden max-md:in-data-[view=overview]:flex",
  holdings: "max-md:hidden max-md:in-data-[view=holdings]:flex",
  accounts: "max-md:hidden max-md:in-data-[view=accounts]:flex",
}
