import { describe, expect, it } from "vitest"

import { getServerEnv } from "./env"

describe("getServerEnv", () => {
  it("allows running without Supabase (in-memory waitlist)", () => {
    expect(getServerEnv({})).toEqual({})
  })

  it("treats empty strings as unset", () => {
    expect(
      getServerEnv({ NEXT_PUBLIC_SUPABASE_URL: "", SUPABASE_SECRET_KEY: "" }),
    ).toEqual({})
  })

  it("parses a complete Supabase configuration", () => {
    expect(
      getServerEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
        SUPABASE_SECRET_KEY: "sb_secret_abc",
      }),
    ).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
      SUPABASE_SECRET_KEY: "sb_secret_abc",
    })
  })

  it("ignores the publishable key (the server never uses it)", () => {
    expect(
      getServerEnv({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_x",
      }),
    ).toEqual({})
  })

  it("fails when only the URL is set (e.g. secret key missing in Vercel)", () => {
    expect(() =>
      getServerEnv({ NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co" }),
    ).toThrow(/Set both NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY/)
  })

  it("fails when the publishable key is used as the secret key", () => {
    expect(() =>
      getServerEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
        SUPABASE_SECRET_KEY: "sb_publishable_abc",
      }),
    ).toThrow(/holds a publishable key/)
  })

  it("fails on an invalid Supabase URL", () => {
    expect(() =>
      getServerEnv({
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
        SUPABASE_SECRET_KEY: "key",
      }),
    ).toThrow(/Invalid environment variables/)
  })
})
