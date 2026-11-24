import { describe, expect, it } from "vitest"

import { learn } from "../data"
import { DEFAULT_LEARNED, concepts, units } from "./data"
import { learnSummary, minutesLeft, nextConcept, streakDays } from "./progress"

describe("learnSummary", () => {
  it("counts one lesson per concept, as the landing's card does", () => {
    expect(learnSummary(DEFAULT_LEARNED)).toEqual(learn.progress)
    expect(learnSummary([])).toEqual({ done: 0, total: concepts.length })
    expect(learnSummary(["concentration"])).toEqual({ done: 1, total: 5 })
  })

  it("counts the minutes left and the streak", () => {
    expect(minutesLeft([])).toBe(10)
    expect(minutesLeft(["concentration"])).toBe(8)
    expect(streakDays("firstRun", [])).toBe(0)
    expect(streakDays("firstRun", ["concentration"])).toBe(1)
  })
})

describe("units", () => {
  it("lay out every concept once, in the course's order", () => {
    expect(units.flatMap((unit) => unit.concepts)).toEqual(
      concepts.map((concept) => concept.id),
    )
  })
})

describe("nextConcept", () => {
  it("suggests Concentration first, then the next one not learned", () => {
    expect(nextConcept([])?.id).toBe("concentration")
    expect(nextConcept(["concentration"])?.id).toBe("rebalancing")
    expect(nextConcept(DEFAULT_LEARNED)?.id).toBe("concentration")
    expect(nextConcept(concepts.map((c) => c.id))).toBeNull()
  })
})
