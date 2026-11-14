import { describe, expect, it } from "vitest"

import { getServerEnv } from "./env"

describe("getServerEnv", () => {
  it("allows running without Supabase (in-memory waitlist)", () => {
    expect(getServerEnv({})).toEqual({})
  })

  it("treats empty strings as unset", () => {
    expect(
      getServerEnv({ SUPABASE_URL: "", SUPABASE_SERVICE_ROLE_KEY: "" }),
    ).toEqual({})
  })

  it("parses a complete Supabase configuration", () => {
    expect(
      getServerEnv({
        SUPABASE_URL: "https://abc.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      }),
    ).toEqual({
      SUPABASE_URL: "https://abc.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    })
  })

  it("fails when only one of the Supabase variables is set", () => {
    expect(() =>
      getServerEnv({ SUPABASE_URL: "https://abc.supabase.co" }),
    ).toThrow(/Set both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/)
  })

  it("fails on an invalid Supabase URL", () => {
    expect(() =>
      getServerEnv({
        SUPABASE_URL: "not-a-url",
        SUPABASE_SERVICE_ROLE_KEY: "key",
      }),
    ).toThrow(/Invalid environment variables/)
  })
})
