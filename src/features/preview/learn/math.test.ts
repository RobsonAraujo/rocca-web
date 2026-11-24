import { describe, expect, it } from "vitest"

import { preview } from "@/features/landing/content"

import { portfolioTotal } from "../portfolio/data"
import { concepts, nvdaTotalLabel } from "./data"
import {
  brokerageTaxLabel,
  lossIfDrop,
  nvdaDirectAtLimit,
  nvdaDirectValue,
  nvdaPositions,
  nvdaSale,
  nvdaSaleGain,
  nvdaSaleTax,
  nvdaShare,
  parseUsd,
} from "./math"

describe("lesson math", () => {
  it("finds NVDA at 22% of the money: 18% direct plus 4.1% inside funds", () => {
    expect(nvdaShare.total).toBeCloseTo(0.221, 3)
    expect(nvdaTotalLabel).toBe("22%")
    // The direct share matches the holdings, split across two brokers.
    expect(nvdaDirectValue / portfolioTotal).toBeCloseTo(nvdaShare.direct, 3)
    expect(Object.keys(nvdaPositions)).toEqual(["Brokerage", "Roth IRA"])
  })

  it("prices a 30% drop today and at the 12% limit", () => {
    expect(Math.round(lossIfDrop(0.3))).toBe(16463)
    expect(Math.round(lossIfDrop(0.3, nvdaDirectAtLimit))).toBe(11993)
    expect(lossIfDrop(0.5)).toBeGreaterThan(lossIfDrop(0.1))
  })

  it("estimates the brokerage tax the landing and the card promise", () => {
    expect(nvdaSale).toBe(parseUsd(preview.order.lines[0].amount))
    expect(Math.round(nvdaSaleGain)).toBe(5080)
    expect(brokerageTaxLabel).toBe("~$765")
    // The 15% estimate lands within $15 of the "~$765" everyone shows.
    expect(Math.abs(nvdaSaleTax - parseUsd(brokerageTaxLabel))).toBeLessThan(15)
  })

  it("ties every concept of the course to the portfolio", () => {
    const tie = (id: string) => concepts.find((c) => c.id === id)!.tie
    expect(tie("concentration")).toBe("NVDA is 22% of your money")
    expect(tie("rebalancing")).toMatch(/US stocks are 70% .* target is 60%/)
    expect(tie("tax-loss-harvesting")).toMatch(/down 9\.8%: about \$149/)
    expect(tie("expense-ratio")).toMatch(/0\.85%: \$385 a year/)
    expect(tie("roth-ira")).toBe("Your E*TRADE Roth IRA, $48,211")
    expect(concepts.filter((c) => c.playable).map((c) => c.id)).toEqual([
      "concentration",
    ])
  })
})
