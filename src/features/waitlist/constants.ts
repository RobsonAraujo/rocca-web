/** Form field names shared by the waitlist form and its server action. */
export const WAITLIST_FIELDS = {
  email: "email",
  /** Hidden attribution value, filled from `?utm_source=` on the client. */
  source: "source",
  /** Honeypot: hidden from humans, bots tend to fill it. */
  honeypot: "company",
} as const
