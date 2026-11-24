import { describe, expect, it } from "vitest"

import type { AchievementContext } from "./achievements"
import { achievements, earnedAchievements, unitTrophies } from "./achievements"
import { DEFAULT_LEARNED, concepts } from "./data"

const earned = (context: AchievementContext) =>
  earnedAchievements(context)
    .filter((badge) => badge.done)
    .map((badge) => badge.id)

const fresh: AchievementContext = {
  learned: [],
  approvedInformed: false,
  ruleEarned: false,
  streak: 0,
}

describe("achievements", () => {
  it("starts a new account with the full picture only", () => {
    expect(earned(fresh)).toEqual(["full-picture"])
  })

  it("lights four badges by the end of the demo", () => {
    expect(
      earned({
        learned: ["concentration"],
        approvedInformed: true,
        ruleEarned: true,
        streak: 1,
      }),
    ).toEqual(["full-picture", "first-lesson", "knows-why", "rule-earned"])
  })

  it("rewards units, the streak and the whole course", () => {
    const all = concepts.map((concept) => concept.id)
    expect(earned({ ...fresh, learned: all, streak: 7 })).toEqual(
      expect.arrayContaining([...unitTrophies, "on-a-roll", "in-control"]),
    )
    expect(earned({ ...fresh, learned: DEFAULT_LEARNED, streak: 6 })).toEqual([
      "full-picture",
      "first-lesson",
    ])
  })

  it("has a trophy for each unit, and eight badges in all", () => {
    expect(achievements).toHaveLength(8)
    for (const id of unitTrophies) {
      expect(achievements.some((badge) => badge.id === id)).toBe(true)
    }
  })
})
