import "server-only"

import { z } from "zod"

/** Treats empty strings (e.g. `SUPABASE_SECRET_KEY=` in .env) as "not set". */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional())

const serverEnvSchema = z
  .object({
    // The project URL isn't a secret; same name as in the Supabase docs.
    NEXT_PUBLIC_SUPABASE_URL: optional(z.url()),
    // The secret key (sb_secret_...). Server only: never prefix with NEXT_PUBLIC_.
    SUPABASE_SECRET_KEY: optional(z.string()),
    // News providers, tried in this order: Massive, then Finnhub. With
    // neither, the news card shows simulated headlines.
    MASSIVE_API_KEY: optional(z.string()),
    FINNHUB_API_KEY: optional(z.string()),
  })
  .refine(
    (env) =>
      Boolean(env.NEXT_PUBLIC_SUPABASE_URL) ===
      Boolean(env.SUPABASE_SECRET_KEY),
    {
      error:
        "Set both NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY, or neither (to use the in-memory waitlist).",
    },
  )
  .refine((env) => !env.SUPABASE_SECRET_KEY?.startsWith("sb_publishable_"), {
    // The publishable key can't write to the waitlist (RLS + revoked grants).
    error:
      "SUPABASE_SECRET_KEY holds a publishable key (sb_publishable_...). Use the project's secret key (sb_secret_...).",
  })

export type ServerEnv = z.infer<typeof serverEnvSchema>

/**
 * Parses server-only environment variables. Called lazily (not at import time)
 * so a misconfigured env fails the request that needs it, with a clear message.
 */
export function getServerEnv(
  source: Record<string, string | undefined> = process.env,
): ServerEnv {
  const parsed = serverEnvSchema.safeParse(source)
  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
    )
  }
  return parsed.data
}
