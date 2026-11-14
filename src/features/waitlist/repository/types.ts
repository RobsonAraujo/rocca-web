export type WaitlistEntry = {
  /** Already normalized (trimmed, lowercased). */
  email: string
  source?: string
}

export type InsertResult = "created" | "duplicate"

/**
 * Persistence port for the waitlist. Implementations must enforce email
 * uniqueness atomically (unique index / map key), not check-then-insert.
 */
export interface WaitlistRepository {
  insert(entry: WaitlistEntry): Promise<InsertResult>
}
