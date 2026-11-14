import type { WaitlistEntry, WaitlistRepository } from "./repository/types"

export type AddToWaitlistResult =
  { status: "joined" } | { status: "already_joined" }

/**
 * Business rule for joining the waitlist. Framework-free and takes its
 * repository as an argument, so it is tested without mocking modules.
 * Future rules (confirmation email, referrals, queue position) belong here.
 */
export async function addToWaitlist(
  entry: WaitlistEntry,
  repository: WaitlistRepository,
): Promise<AddToWaitlistResult> {
  const result = await repository.insert({
    email: entry.email.trim().toLowerCase(),
    source: entry.source,
  })

  return result === "created"
    ? { status: "joined" }
    : { status: "already_joined" }
}
