/** "Nov 19, 3:42 PM ET": absolute, in market time. */
const absolute = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
})

/** "Nov 18": for stories older than a day. */
const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "America/New_York",
})

export function formatNewsTime(iso: string) {
  return `${absolute.format(new Date(iso))} ET`
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * "Just now", "12m ago", "3h ago", then "Nov 18", the way news sites date
 * stories. Needs the reader's clock, so it's computed in the browser (see
 * NewsTime); the server renders `formatNewsTime` instead.
 */
export function formatRelativeTime(iso: string, now: number) {
  const elapsed = now - Date.parse(iso)
  if (elapsed < MINUTE) return "Just now"
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`
  return shortDate.format(new Date(iso))
}
