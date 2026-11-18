import { existsSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { parseEnv } from "node:util"

import { defineConfig } from "vitest/config"

/** .env.local as an object (empty when the file doesn't exist). */
function readEnvLocal() {
  const file = new URL("./.env.local", import.meta.url)
  return existsSync(file) ? parseEnv(readFileSync(file, "utf8")) : {}
}

/**
 * Integration tests against the LOCAL Supabase (`pnpm db:start`). Reads the
 * local URL and keys from .env.local; the tests refuse to run against any
 * host that isn't localhost.
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "server-only": fileURLToPath(
        new URL("./test/stubs/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.integration.test.ts"],
    // Shell variables win over .env.local (handy in CI).
    env: { ...readEnvLocal(), ...process.env } as Record<string, string>,
    // One shared database: run files one after another.
    fileParallelism: false,
  },
})
