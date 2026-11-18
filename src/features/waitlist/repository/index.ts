import "server-only"

import { getServerEnv } from "@/lib/env"

import { InMemoryWaitlistRepository } from "./in-memory"
import { createSupabaseWaitlistRepository } from "./supabase"
import type { WaitlistRepository } from "./types"

export type { InsertResult, WaitlistEntry, WaitlistRepository } from "./types"

// Kept on globalThis so the in-memory list survives dev hot reloads.
const store = globalThis as typeof globalThis & {
  __roccaWaitlistRepository?: WaitlistRepository
}

/**
 * Picks the waitlist backend: Supabase when its env vars are set, otherwise
 * the in-memory mock. Swapping backends needs no change outside this folder.
 */
export function getWaitlistRepository(): WaitlistRepository {
  if (store.__roccaWaitlistRepository) return store.__roccaWaitlistRepository

  const env = getServerEnv()
  let repository: WaitlistRepository

  if (env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SECRET_KEY) {
    repository = createSupabaseWaitlistRepository(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SECRET_KEY,
    )
  } else {
    console.warn(
      "[waitlist] Supabase is not configured: using the in-memory repository. Signups are lost on restart.",
    )
    repository = new InMemoryWaitlistRepository()
  }

  store.__roccaWaitlistRepository = repository
  return repository
}
