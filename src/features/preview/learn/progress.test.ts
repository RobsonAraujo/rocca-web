import { describe, expect, it } from "vitest"

import { learn } from "../data"
import { DEFAULT_LEARNED, concepts, units } from "./data"
import {
  learnSummary,
  levelFor,
  minutesLeft,
  nextConcept,
  streakDays,
  streakWeek,
  xpFor,
} from "./progress"

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

describe("streak", () => {
  it("adds today once a lesson is done", () => {
    expect(streakDays("default", DEFAULT_LEARNED)).toBe(6)
    expect(streakDays("default", [...DEFAULT_LEARNED, "concentration"])).toBe(7)
  })

  it("fills the week up to today", () => {
    const before = streakWeek("default", DEFAULT_LEARNED)
    expect(before.filter((day) => day.done)).toHaveLength(6)
    expect(before.at(-1)).toMatchObject({ today: true, done: false })

    const firstRun = streakWeek("firstRun", ["concentration"])
    expect(firstRun.map((day) => day.done)).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
      true,
    ])
  })
})

describe("levels", () => {
  it("earns 20 XP a lesson and climbs at 40, 80 and 100", () => {
    expect(xpFor(["concentration"])).toBe(20)
    expect(levelFor(0)).toMatchObject({ toNext: 40, progress: 0 })
    expect(levelFor(20).current.name).toBe("Curious")
    expect(levelFor(20).progress).toBe(0.5)
    expect(levelFor(60).current.name).toBe("Informed")
    expect(levelFor(100)).toMatchObject({ next: null, progress: 1 })
    expect(levelFor(xpFor(concepts.map((c) => c.id))).current.name).toBe(
      "In control",
    )
  })
})
