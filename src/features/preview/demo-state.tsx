"use client"

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { autonomy } from "./data"

export type ModeId = (typeof autonomy.levels)[number]["id"]

/** Where the NVDA suggestion is in the simulated flow. */
export type SuggestionStatus = "pending" | "placing" | "done" | "skipped"

/** How long the fake "placing orders" step lasts before the receipt. */
export const PLACING_MS = 1200

type DemoState = {
  suggestion: SuggestionStatus
  mode: ModeId
  approve: () => void
  skip: () => void
  reset: () => void
  setMode: (mode: ModeId) => void
}

const DemoContext = createContext<DemoState | null>(null)

/**
 * Simulated state shared by the preview pages: the NVDA decision and the
 * autonomy mode. It lives in the preview layout, so it survives moving
 * between Overview and Portfolio. It isn't persisted: a reload starts the
 * demo over, which is what a preview should do.
 */
export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [suggestion, setSuggestion] = useState<SuggestionStatus>("pending")
  const [mode, setMode] = useState<ModeId>(autonomy.current)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const approve = useCallback(() => {
    clearTimeout(timer.current)
    setSuggestion("placing")
    timer.current = setTimeout(() => setSuggestion("done"), PLACING_MS)
  }, [])

  const skip = useCallback(() => {
    clearTimeout(timer.current)
    setSuggestion("skipped")
  }, [])

  const reset = useCallback(() => {
    clearTimeout(timer.current)
    setSuggestion("pending")
    setMode(autonomy.current)
  }, [])

  const value = useMemo(
    () => ({ suggestion, mode, approve, skip, reset, setMode }),
    [suggestion, mode, approve, skip, reset],
  )

  return <DemoContext value={value}>{children}</DemoContext>
}

export function useDemo() {
  const value = use(DemoContext)
  if (!value) throw new Error("useDemo must be used inside DemoStateProvider")
  return value
}
