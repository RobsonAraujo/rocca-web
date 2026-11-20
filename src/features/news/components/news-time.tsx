"use client"

import { useSyncExternalStore } from "react"

import { formatNewsTime, formatRelativeTime } from "../format"

const MINUTE = 60_000

/** The reader's clock, in whole minutes: re-renders once a minute. */
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, MINUTE)
  return () => clearInterval(id)
}
const currentMinute = () => Math.floor(Date.now() / MINUTE) * MINUTE
// The server (and the cached card) can't know the reader's "now".
const noClock = () => null

/**
 * "3h ago" in the browser. The server and the first paint show the absolute
 * time ("Nov 19, 3:42 PM ET"), which stays as the tooltip, so a cached card
 * never shows a stale relative time.
 */
export function NewsTime({ iso }: { iso: string }) {
  const now = useSyncExternalStore(subscribe, currentMinute, noClock)
  const absolute = formatNewsTime(iso)
  return (
    <time dateTime={iso} title={absolute}>
      {now === null ? absolute : formatRelativeTime(iso, now)}
    </time>
  )
}
