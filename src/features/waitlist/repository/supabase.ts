import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import type { InsertResult, WaitlistEntry, WaitlistRepository } from "./types"

/** Postgres error code for `unique_violation`. */
const UNIQUE_VIOLATION = "23505"

export const WAITLIST_TABLE = "waitlist"

/** Only the part of the client this repository uses, so tests can fake it. */
export type WaitlistSupabaseClient = Pick<SupabaseClient, "from">

/**
 * Writes to `public.waitlist` (see supabase/migrations). Uses the service role
 * key server-side; the table has RLS on and no public policies.
 */
export class SupabaseWaitlistRepository implements WaitlistRepository {
  constructor(private readonly client: WaitlistSupabaseClient) {}

  async insert(entry: WaitlistEntry): Promise<InsertResult> {
    const { error } = await this.client
      .from(WAITLIST_TABLE)
      .insert({ email: entry.email, source: entry.source ?? null })

    if (!error) return "created"
    if (error.code === UNIQUE_VIOLATION) return "duplicate"

    throw new Error(`Failed to insert waitlist entry: ${error.message}`, {
      cause: error,
    })
  }
}

export function createSupabaseWaitlistRepository(
  url: string,
  serviceRoleKey: string,
): SupabaseWaitlistRepository {
  const client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return new SupabaseWaitlistRepository(client)
}
