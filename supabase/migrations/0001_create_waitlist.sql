-- Waitlist signups from the landing page.
-- Written only by the Next.js server using the service role key.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) <= 254),
  source text check (char_length(source) <= 64),
  created_at timestamptz not null default now()
);

-- Case-insensitive uniqueness. Duplicate inserts fail with 23505, which the
-- app maps to "already on the list" (no check-then-insert race).
create unique index if not exists waitlist_email_lower_key
  on public.waitlist (lower(email));

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

-- RLS on with no policies: anon/authenticated clients cannot read or write.
-- The service role bypasses RLS.
alter table public.waitlist enable row level security;
