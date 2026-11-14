import { describe, expect, it } from "vitest"

import { normalizeSource, waitlistSchema } from "./schema"

describe("waitlistSchema", () => {
  it("accepts a valid email and normalizes it", () => {
    const result = waitlistSchema.safeParse({
      email: "  Jane.Doe@Example.COM ",
    })

    expect(result.success).toBe(true)
    expect(result.data?.email).toBe("jane.doe@example.com")
  })

  it("asks for an email when the field is empty or blank", () => {
    for (const email of ["", "   "]) {
      const result = waitlistSchema.safeParse({ email })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0]?.message).toBe("Enter your email address.")
    }
  })

  it("rejects malformed emails with a friendly message", () => {
    for (const email of [
      "jane",
      "jane@",
      "@example.com",
      "jane doe@example.com",
    ]) {
      const result = waitlistSchema.safeParse({ email })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0]?.message).toBe(
        "Enter a valid email address.",
      )
    }
  })

  it("rejects emails longer than 254 characters", () => {
    const email = `${"a".repeat(250)}@example.com`
    const result = waitlistSchema.safeParse({ email })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      "That email address is too long.",
    )
  })

  it("rejects a missing email", () => {
    expect(waitlistSchema.safeParse({}).success).toBe(false)
  })
})

describe("normalizeSource", () => {
  it("lowercases and trims a valid source", () => {
    expect(normalizeSource("  Twitter ")).toBe("twitter")
    expect(normalizeSource("product_hunt-2026.launch")).toBe(
      "product_hunt-2026.launch",
    )
  })

  it("drops empty, non-string, too long or unsafe values", () => {
    expect(normalizeSource(null)).toBeUndefined()
    expect(normalizeSource("")).toBeUndefined()
    expect(normalizeSource("a".repeat(65))).toBeUndefined()
    expect(normalizeSource("<script>")).toBeUndefined()
    expect(normalizeSource("has space")).toBeUndefined()
  })
})
