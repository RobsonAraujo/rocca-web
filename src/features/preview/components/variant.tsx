"use client"

import { useDemo } from "../demo-state"

/**
 * Picks between two server-rendered slots by the demo variant, so widgets
 * that differ on a first run (the track record) stay server components.
 */
export function VariantSwitch({
  fallback,
  firstRun,
}: {
  fallback: React.ReactNode
  firstRun: React.ReactNode
}) {
  const { variant } = useDemo()
  return variant === "firstRun" ? firstRun : fallback
}
