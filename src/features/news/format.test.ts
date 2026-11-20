import { describe, expect, it } from "vitest"

import { formatNewsTime, formatRelativeTime } from "./format"

const published = "2026-11-19T20:42:00Z"
const after = (ms: number) => Date.parse(published) + ms
const MINUTE = 60_000

describe("formatNewsTime", () => {
  it("shows the exact time in market time (ET)", () => {
    expect(formatNewsTime(published)).toBe("Nov 19, 3:42 PM ET")
  })
})

describe("formatRelativeTime", () => {
  it.each([
    [30_000, "Just now"],
    [12 * MINUTE, "12m ago"],
    [3 * 60 * MINUTE + 5 * MINUTE, "3h ago"],
    [30 * 60 * MINUTE, "Nov 19"],
  ])("after %i ms reads %s", (elapsed, expected) => {
    expect(formatRelativeTime(published, after(elapsed))).toBe(expected)
  })
})
