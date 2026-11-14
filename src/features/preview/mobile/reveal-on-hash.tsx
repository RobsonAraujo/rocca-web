"use client"

import { useEffect, useRef } from "react"

/**
 * Phones render their own copy of a section, so the desktop anchor
 * (e.g. /preview#suggestion) points at a hidden element there. When the URL
 * carries the hash, scroll this wrapper into view instead.
 */
export function RevealOnHash({
  hash,
  children,
}: {
  hash: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.location.hash !== `#${hash}`) return
    ref.current?.scrollIntoView({ block: "start" })
  }, [hash])

  return (
    <div ref={ref} className="scroll-mt-20">
      {children}
    </div>
  )
}
