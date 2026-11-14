import type { InsertResult, WaitlistEntry, WaitlistRepository } from "./types"

type StoredEntry = WaitlistEntry & { createdAt: Date }

/**
 * Mock repository used until Supabase is configured. Data lives in process
 * memory: it resets on restart and is not shared between serverless instances.
 */
export class InMemoryWaitlistRepository implements WaitlistRepository {
  private readonly entries = new Map<string, StoredEntry>()

  async insert(entry: WaitlistEntry): Promise<InsertResult> {
    const key = entry.email.toLowerCase()
    if (this.entries.has(key)) return "duplicate"

    this.entries.set(key, { ...entry, createdAt: new Date() })
    return "created"
  }

  get size(): number {
    return this.entries.size
  }
}
