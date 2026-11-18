#!/usr/bin/env bash
#
# Applies pending migrations to the PRODUCTION Supabase. Run by a person,
# from a terminal, after everything passes locally: `pnpm db:migrate:prod`.
#
# - The project ref (not a secret) comes from SUPABASE_PROD_PROJECT_REF in
#   .env.local. The app never reads that variable.
# - The database password comes from, in order: SUPABASE_DB_PASSWORD in the
#   shell, the macOS Keychain (see README, "Senha de prod no Keychain"), or a
#   prompt. It is never written to a file or passed on the command line.
# - Local checks run first: a fresh local reset plus the integration tests.
# - You see the dry run and must type "yes" before anything is applied.
# - The repo is unlinked from production when the script exits, however it
#   exits, so no later `supabase` command can hit production by accident.

set -euo pipefail

cd "$(dirname "$0")/.."

# Keychain item: service below, account = the project ref.
KEYCHAIN_SERVICE="rocca-supabase-prod"

red() { printf '\033[31m%s\033[0m\n' "$*"; }
bold() { printf '\033[1m%s\033[0m\n' "$*"; }
fail() {
  red "✗ $*"
  exit 1
}

# A person must be at the keyboard: no CI, no scripts, no agents piping input.
[[ -t 0 && -t 1 ]] || fail "Run this from an interactive terminal."

command -v supabase >/dev/null || fail "Supabase CLI not found."

# Read only this one variable from .env.local (the file isn't sourced).
ref=""
if [[ -f .env.local ]]; then
  ref=$(grep -E '^SUPABASE_PROD_PROJECT_REF=' .env.local | tail -1 | cut -d= -f2- | tr -d '"'"'"' ' || true)
fi
[[ -n "$ref" ]] || fail "Set SUPABASE_PROD_PROJECT_REF in .env.local (Supabase → Project Settings → General → Project ID)."
[[ "$ref" =~ ^[a-z0-9]{20}$ ]] || fail "SUPABASE_PROD_PROJECT_REF doesn't look like a project ref: \"$ref\"."

bold "1/4 Local checks (resets the LOCAL database)"
pnpm db:reset
pnpm test:integration

bold "2/4 Linking production project $ref"
password_source="shell"
if [[ -z "${SUPABASE_DB_PASSWORD:-}" ]]; then
  # macOS asks for permission on every read (the item is saved with -T "").
  # Denied or missing item: fall back to the prompt.
  if command -v security >/dev/null &&
    SUPABASE_DB_PASSWORD=$(security find-generic-password -s "$KEYCHAIN_SERVICE" -a "$ref" -w 2>/dev/null) &&
    [[ -n "$SUPABASE_DB_PASSWORD" ]]; then
    password_source="keychain"
    echo "Using the password from the macOS Keychain."
  else
    read -r -s -p "Production database password: " SUPABASE_DB_PASSWORD
    echo
    password_source="prompt"
  fi
fi
[[ -n "$SUPABASE_DB_PASSWORD" ]] || fail "The database password is required."
# The CLI reads the password from this variable, which keeps it out of `ps`.
export SUPABASE_DB_PASSWORD

# Copy of the link output (no secrets in it), to explain a failure below.
link_log=$(mktemp)

# From here on, always unlink on exit (success, failure or Ctrl+C).
trap 'rm -f "$link_log"; supabase unlink >/dev/null 2>&1 || true' EXIT

# tee keeps the output live; pipefail keeps the link's exit status.
if ! supabase link --project-ref "$ref" 2>&1 | tee "$link_log"; then
  # The API check runs before the database connection: an account problem
  # here means the password wasn't even tried.
  if grep -qiE "privileges|unauthorized|forbidden|access token|not logged in" "$link_log"; then
    fail "The Supabase CLI is logged in with an account that can't access $ref. Run \`supabase logout && supabase login\` with the account that owns it (\`supabase projects list\` must show it), then try again."
  fi
  if grep -qi "password authentication failed" "$link_log"; then
    if [[ "$password_source" == "keychain" ]]; then
      fail "Wrong database password in the Keychain. Update it: security add-generic-password -U -s $KEYCHAIN_SERVICE -a $ref -T \"\" -w"
    fi
    fail "Wrong database password (Supabase → Project Settings → Database)."
  fi
  fail "Could not link $ref (see the error above)."
fi

bold "3/4 Dry run: what would be applied to PRODUCTION"
if ! plan=$(supabase db push --linked --dry-run 2>&1); then
  echo "$plan"
  fail "Dry run failed. Nothing was applied."
fi
echo "$plan"
if grep -qi "up to date" <<<"$plan"; then
  bold "Nothing to apply. Production is up to date."
  exit 0
fi

echo
red "This changes the PRODUCTION database ($ref)."
read -r -p "Type \"yes\" to apply: " answer
[[ "$answer" == "yes" ]] || fail "Cancelled. Nothing was applied."

bold "4/4 Applying"
supabase db push --linked
bold "✓ Done."
