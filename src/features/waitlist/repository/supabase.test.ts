import { describe, expect, it, vi } from "vitest"

import {
  SupabaseWaitlistRepository,
  WAITLIST_TABLE,
  type WaitlistSupabaseClient,
} from "./supabase"

type FakeError = { code: string; message: string } | null

function createFakeClient(error: FakeError) {
  const insert = vi.fn().mockResolvedValue({ error })
  const from = vi.fn().mockReturnValue({ insert })
  return { client: { from } as unknown as WaitlistSupabaseClient, from, insert }
}

describe("SupabaseWaitlistRepository", () => {
  it("inserts into the waitlist table and reports created", async () => {
    const { client, from, insert } = createFakeClient(null)
    const repository = new SupabaseWaitlistRepository(client)

    await expect(
      repository.insert({ email: "jane@example.com", source: "twitter" }),
    ).resolves.toBe("created")
    expect(from).toHaveBeenCalledWith(WAITLIST_TABLE)
    expect(insert).toHaveBeenCalledWith({
      email: "jane@example.com",
      source: "twitter",
    })
  })

  it("stores a missing source as null", async () => {
    const { client, insert } = createFakeClient(null)

    await new SupabaseWaitlistRepository(client).insert({
      email: "jane@example.com",
    })

    expect(insert).toHaveBeenCalledWith({
      email: "jane@example.com",
      source: null,
    })
  })

  it("maps a unique violation (23505) to duplicate", async () => {
    const { client } = createFakeClient({
      code: "23505",
      message: "duplicate key",
    })

    await expect(
      new SupabaseWaitlistRepository(client).insert({
        email: "jane@example.com",
      }),
    ).resolves.toBe("duplicate")
  })

  it("throws on any other database error", async () => {
    const { client } = createFakeClient({
      code: "42501",
      message: "permission denied",
    })

    await expect(
      new SupabaseWaitlistRepository(client).insert({
        email: "jane@example.com",
      }),
    ).rejects.toThrow("Failed to insert waitlist entry: permission denied")
  })
})
