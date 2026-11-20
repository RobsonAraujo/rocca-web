import { describe, expect, it } from "vitest"

import { preview } from "@/features/landing/content"

import { portfolio } from "../data"
import { pointAge, seriesChange } from "./chart-ranges"

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

describe("benchmark series", () => {
  it("starts with the portfolio and has a point for every close", () => {
    for (const range of portfolio.chart.ranges) {
      const { values, benchmark } = portfolio.chart.series[range]
      expect(benchmark).toHaveLength(values.length)
      expect(benchmark[0]).toBe(values[0])
    }
  })
})

describe("pointAge", () => {
  it("counts back from today in the range's own unit", () => {
    expect(pointAge({ unit: "day", size: 1 }, 0)).toBe(portfolio.chart.today)
    expect(pointAge({ unit: "day", size: 1 }, 1)).toBe("Yesterday")
    expect(pointAge({ unit: "day", size: 1 }, 12)).toBe("12 days ago")
    expect(pointAge({ unit: "week", size: 2 }, 3)).toBe("6 weeks ago")
    expect(pointAge({ unit: "week", size: 2 }, 23)).toBe("11 months ago")
    expect(pointAge({ unit: "month", size: 3 }, 21)).toBe("5 years ago")
  })
})
