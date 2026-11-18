import { createClient } from "@supabase/supabase-js"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { createSupabaseWaitlistRepository, WAITLIST_TABLE } from "./supabase"

/**
 * Runs against the LOCAL Supabase (`pnpm db:start`, then
 * `pnpm test:integration`). Checks what unit tests can't: the real table,
 * the case-insensitive unique index, and that RLS + revoked grants keep the
 * public key out.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const secretKey = process.env.SUPABASE_SECRET_KEY ?? ""
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ""

// Safety net: these tests write and delete rows. Never against a real project.
const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost"])

function assertLocal() {
  const host = URL.canParse(url) ? new URL(url).hostname : ""
  if (!LOCAL_HOSTS.has(host)) {
    throw new Error(
      `Integration tests only run against a local Supabase. NEXT_PUBLIC_SUPABASE_URL is "${url || "(empty)"}". Run \`pnpm db:start\` and point .env.local at it.`,
    )
  }
  if (!secretKey || !publishableKey) {
    throw new Error(
      "Set SUPABASE_SECRET_KEY and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local (values from `pnpm db:status`).",
    )
  }
}

// Unique per run, so a leftover row never breaks the next run.
const runId = Date.now().toString(36)
const email = `it-${runId}@example.com`

const clientOptions = {
  auth: { persistSession: false, autoRefreshToken: false },
}

describe("waitlist on the local Supabase", () => {
  beforeAll(assertLocal)

  afterAll(async () => {
    if (!LOCAL_HOSTS.has(URL.canParse(url) ? new URL(url).hostname : "")) {
      return
    }
    const admin = createClient(url, secretKey, clientOptions)
    await admin.from(WAITLIST_TABLE).delete().like("email", `it-${runId}%`)
  })

  it("stores a new signup with its source", async () => {
    const repository = createSupabaseWaitlistRepository(url, secretKey)

    await expect(
      repository.insert({ email, source: "integration" }),
    ).resolves.toBe("created")

    const admin = createClient(url, secretKey, clientOptions)
    const { data, error } = await admin
      .from(WAITLIST_TABLE)
      .select("email, source, created_at")
      .eq("email", email)
      .single()
    expect(error).toBeNull()
    expect(data).toMatchObject({ email, source: "integration" })
    expect(data?.created_at).toEqual(expect.any(String))
  })

  it("treats the same email in another case as a duplicate", async () => {
    const repository = createSupabaseWaitlistRepository(url, secretKey)

    await expect(
      repository.insert({ email: email.toUpperCase() }),
    ).resolves.toBe("duplicate")
  })

  it("keeps the public key out: no reads, no writes", async () => {
    const anon = createClient(url, publishableKey, clientOptions)

    const read = await anon.from(WAITLIST_TABLE).select("email").limit(1)
    expect(read.error?.code).toBe("42501")

    const write = await anon
      .from(WAITLIST_TABLE)
      .insert({ email: `it-${runId}-anon@example.com` })
    expect(write.error?.code).toBe("42501")
  })
})
