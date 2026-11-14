import "server-only"

import { z } from "zod"

/** Treats empty strings (e.g. `SUPABASE_URL=` in .env) as "not set". */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional())

const serverEnvSchema = z
  .object({
    SUPABASE_URL: optional(z.url()),
    SUPABASE_SERVICE_ROLE_KEY: optional(z.string()),
  })
  .refine(
    (env) =>
      Boolean(env.SUPABASE_URL) === Boolean(env.SUPABASE_SERVICE_ROLE_KEY),
    {
      error:
        "Set both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or neither (to use the in-memory waitlist).",
    },
  )

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
