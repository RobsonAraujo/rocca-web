import { describe, expect, it } from "vitest"

import { learn } from "../data"
import { DEFAULT_LEARNED, concepts } from "./data"
import { learnSummary, nextConcept } from "./progress"

describe("learnSummary", () => {
  it("keeps the landing's 3 of 12 for the regular preview", () => {
    expect(learnSummary("default", DEFAULT_LEARNED)).toEqual(learn.progress)
    expect(
      learnSummary("default", [...DEFAULT_LEARNED, "concentration"]),
    ).toEqual({ done: 4, total: 12 })
  })

  it("counts the course's own concepts on a first run", () => {
    expect(learnSummary("firstRun", [])).toEqual({
      done: 0,
      total: concepts.length,
    })
    expect(learnSummary("firstRun", ["concentration"])).toEqual({
      done: 1,
      total: 5,
    })
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
