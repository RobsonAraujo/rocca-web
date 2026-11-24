"use client"

import { cn } from "@/lib/utils"

import { shell } from "../data"
import { useDemo } from "../demo-state"

/** "Good morning", with the persona's name when the demo signed someone in. */
export function Greeting() {
  const { persona } = useDemo()
  return persona ? `${shell.greeting}, ${persona.name}` : shell.greeting
}

/**
 * Who's signed in: the persona from the demo, or the anonymous preview
 * visitor ("You"). A client component, since it follows the demo session.
 */
export function Avatar({ className }: { className?: string }) {
  const { persona } = useDemo()
  return (
    <span
      aria-label={persona?.fullName ?? shell.user.name}
      role="img"
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground",
        className,
      )}
    >
      {persona?.initials ?? shell.user.initials}
    </span>
  )
}

/** Name and plan beside the avatar (the sidebar footer). */
export function useSignedInUser() {
  const { persona } = useDemo()
  return persona
    ? { name: persona.fullName, plan: shell.user.demoPlan }
    : { name: shell.user.name, plan: shell.user.plan }
}
