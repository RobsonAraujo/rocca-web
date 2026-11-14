import { z } from "zod"

export const EMAIL_MAX_LENGTH = 254
export const SOURCE_MAX_LENGTH = 64

export const waitlistSchema = z.object({
  email: z
    .string({ error: "Enter your email address." })
    .trim()
    .toLowerCase()
    .min(1, { error: "Enter your email address." })
    .max(EMAIL_MAX_LENGTH, { error: "That email address is too long." })
    .pipe(z.email({ error: "Enter a valid email address." })),
})

export type WaitlistInput = z.infer<typeof waitlistSchema>

const SOURCE_PATTERN = /^[a-z0-9._-]+$/

/**
 * Attribution is best-effort: an odd `utm_source` must never block a signup,
 * so anything unexpected is dropped instead of failing validation.
 */
export function normalizeSource(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const source = value.trim().toLowerCase()
  if (!source || source.length > SOURCE_MAX_LENGTH) return undefined
  return SOURCE_PATTERN.test(source) ? source : undefined
}
