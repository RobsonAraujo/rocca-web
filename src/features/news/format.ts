/**
 * "Nov 19, 3:42 PM ET". Absolute and in market time, so a cached card never
 * shows a stale "2 hours ago".
 */
const time = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
})

export function formatNewsTime(iso: string) {
  return `${time.format(new Date(iso))} ET`
}
