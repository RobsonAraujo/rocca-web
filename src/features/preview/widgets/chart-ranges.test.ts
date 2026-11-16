import { describe, expect, it } from "vitest"

import { preview } from "@/features/landing/content"

import { portfolio } from "../data"
import { seriesChange } from "./chart-ranges"

const total = Number(preview.portfolio.value.replace(/[$,]/g, ""))

describe("portfolio chart series", () => {
  it("ends every range on today's total from the landing", () => {
    for (const range of portfolio.chart.ranges) {
      const { values } = portfolio.chart.series[range]
      expect(Math.round(values.at(-1)!)).toBe(Math.round(total))
    }
  })

  it("matches the weekly change the landing shows", () => {
    const week = portfolio.chart.series["1W"].values
    expect(seriesChange(week)).toBe("+1.8%")
    expect(Math.round(total) - week[0]!).toBe(4390)
    expect(portfolio.weekChange.amount).toBe("+$4,390")
  })

  it("keeps the past month at +3.4%", () => {
    expect(seriesChange(portfolio.chart.series["1M"].values)).toBe("+3.4%")
  })
})
