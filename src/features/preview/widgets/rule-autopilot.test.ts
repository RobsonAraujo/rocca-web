import { describe, expect, it } from "vitest"

import { rules } from "../data"
import { ruleAutopilot } from "./rule-autopilot"

const rule = rules.autopilot.ruleId

describe("ruleAutopilot", () => {
  it("stays locked until the concept behind the rule is learned", () => {
    expect(
      ruleAutopilot(
        { learned: [], suggestion: "done", autopilotRules: [] },
        rule,
      ),
    ).toBe("locked")
  })

  it("asks for one approval after the lesson", () => {
    for (const suggestion of ["pending", "placing", "skipped"] as const) {
      expect(
        ruleAutopilot(
          { learned: ["concentration"], suggestion, autopilotRules: [] },
          rule,
        ),
      ).toBe("needsApproval")
    }
  })

  it("is ready once learned and approved, and on when turned on", () => {
    const earned = {
      learned: ["concentration"] as const,
      suggestion: "done" as const,
    }
    expect(ruleAutopilot({ ...earned, autopilotRules: [] }, rule)).toBe("ready")
    expect(ruleAutopilot({ ...earned, autopilotRules: [rule] }, rule)).toBe(
      "on",
    )
  })

  it("keeps the other rules locked: only the 12% rule has a path", () => {
    expect(
      ruleAutopilot(
        {
          learned: ["concentration"],
          suggestion: "done",
          autopilotRules: [],
        },
        "crypto",
      ),
    ).toBe("locked")
  })
})
