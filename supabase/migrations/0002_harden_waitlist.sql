-- Defense in depth for the waitlist table.
-- RLS (on, with no policies) already blocks anon and authenticated clients.
-- Supabase also grants table privileges to those roles by default in
-- `public`, so revoke them too: a policy added by mistake later still
-- wouldn't open the table to the publishable key.
-- The service role (used only by the Next.js server) keeps full access.

revoke all on table public.waitlist from anon, authenticated;

grant select, insert, update, delete on table public.waitlist to service_role;
