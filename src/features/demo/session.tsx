"use client"

import { createContext, use, useCallback, useMemo, useState } from "react"

import { illustrations } from "@/features/landing/content"
import type { AccountName } from "@/features/preview/portfolio/data"

import type { ExperienceLevel } from "./content"
import { persona } from "./content"

export type { ExperienceLevel }

/** Where the visitor is in the simulated first visit. */
export type DemoSession = {
  signedIn: boolean
  level: ExperienceLevel | null
  /** Accounts linked so far, in the order they were connected. */
  connected: readonly AccountName[]
  /** Set by "See your dashboard": the preview then plays the first run. */
  finished: boolean
}

type DemoSessionValue = DemoSession & {
  persona: typeof persona
  signIn: () => void
  setLevel: (level: ExperienceLevel) => void
  connect: (account: AccountName) => void
  /** Ends the flow, filling in anything a direct visit skipped. */
  finish: () => void
}

const allAccounts = illustrations.accounts.map((account) => account.name)

export const initialSession: DemoSession = {
  signedIn: false,
  level: null,
  connected: [],
  finished: false,
}

const SessionContext = createContext<DemoSessionValue | null>(null)

/**
 * The demo's session. It lives in the (product) route group's layout, above
 * both /demo and /preview, so it survives the soft navigation from the
 * first look to the dashboard. A reload starts over, like the rest of the
 * demo. `initial` is for tests.
 */
export function DemoSessionProvider({
  initial,
  children,
}: {
  initial?: Partial<DemoSession>
  children: React.ReactNode
}) {
  const [session, setSession] = useState<DemoSession>({
    ...initialSession,
    ...initial,
  })

  const signIn = useCallback(
    () => setSession((s) => ({ ...s, signedIn: true })),
    [],
  )
  const setLevel = useCallback(
    (level: ExperienceLevel) => setSession((s) => ({ ...s, level })),
    [],
  )
  const connect = useCallback(
    (account: AccountName) =>
      setSession((s) =>
        s.connected.includes(account)
          ? s
          : { ...s, connected: [...s.connected, account] },
      ),
    [],
  )
  const finish = useCallback(
    () =>
      setSession((s) => ({
        signedIn: true,
        level: s.level ?? "new",
        connected: [
          ...s.connected,
          ...allAccounts.filter((a) => !s.connected.includes(a)),
        ],
        finished: true,
      })),
    [],
  )

  const value = useMemo(
    () => ({ ...session, persona, signIn, setLevel, connect, finish }),
    [session, signIn, setLevel, connect, finish],
  )

  return <SessionContext value={value}>{children}</SessionContext>
}

export function useDemoSession() {
  const value = use(SessionContext)
  if (!value) {
    throw new Error("useDemoSession must be used inside DemoSessionProvider")
  }
  return value
}

/** The session when there is one; the preview also renders without it. */
export function useOptionalDemoSession() {
  return use(SessionContext)
}
