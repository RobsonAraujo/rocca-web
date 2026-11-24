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

import { useOptionalDemoSession } from "@/features/demo/session"

import type { RuleId } from "./data"
import { autonomy } from "./data"
import type { ConceptId } from "./learn/data"
import { DEFAULT_LEARNED, LESSON_ID } from "./learn/data"

export type ModeId = (typeof autonomy.levels)[number]["id"]

/** Where the NVDA suggestion is in the simulated flow. */
export type SuggestionStatus = "pending" | "placing" | "done" | "skipped"

/**
 * `default`: someone who's been using Rocca (history, 3 lessons done).
 * `firstRun`: the persona arriving from the recordable demo (/demo), with a
 * brand-new account: nothing learned yet, and a track record that starts today.
 */
export type Variant = "default" | "firstRun"

/** Who's signed in, when the demo session says so. */
export type Persona = {
  name: string
  fullName: string
  initials: string
  accounts: number
  /** New or some experience: plain English and lessons up front. */
  explainSimply: boolean
}

/** How long the fake "placing orders" step lasts before the receipt. */
export const PLACING_MS = 1200

type DemoState = {
  variant: Variant
  persona: Persona | null
  suggestion: SuggestionStatus
  mode: ModeId
  /** Concepts learned, in order. */
  learned: readonly ConceptId[]
  /** The trim was approved after the lesson: you knew why. */
  approvedInformed: boolean
  /** Rules handed to Autopilot. */
  autopilotRules: readonly RuleId[]
  approve: () => void
  skip: () => void
  reset: () => void
  setMode: (mode: ModeId) => void
  completeLesson: (id: ConceptId) => void
  setRuleAutopilot: (id: RuleId, on: boolean) => void
}

const DemoContext = createContext<DemoState | null>(null)

const initialLearned = (variant: Variant): readonly ConceptId[] =>
  variant === "firstRun" ? [] : DEFAULT_LEARNED

/**
 * Simulated state shared by the preview pages: the NVDA decision, the
 * autonomy mode, the lessons and the rules on Autopilot. It lives in the
 * preview layout, so it survives moving between pages. It isn't persisted:
 * a reload starts the demo over, which is what a preview should do.
 *
 * The variant comes from the demo session (features/demo), when there is
 * one. The inner provider is keyed by it, so arriving from the demo always
 * starts a clean first run.
 */
export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const session = useOptionalDemoSession()
  const variant: Variant = session?.finished ? "firstRun" : "default"
  const persona = useMemo<Persona | null>(
    () =>
      session?.finished
        ? {
            name: session.persona.name,
            fullName: session.persona.fullName,
            initials: session.persona.initials,
            accounts: session.connected.length,
            explainSimply: session.level !== "experienced",
          }
        : null,
    [session],
  )
  return (
    <DemoStateRoot key={variant} variant={variant} persona={persona}>
      {children}
    </DemoStateRoot>
  )
}

function DemoStateRoot({
  variant,
  persona,
  children,
}: {
  variant: Variant
  persona: Persona | null
  children: React.ReactNode
}) {
  const [suggestion, setSuggestion] = useState<SuggestionStatus>("pending")
  const [mode, setMode] = useState<ModeId>(autonomy.current)
  const [learned, setLearned] = useState(() => initialLearned(variant))
  const [approvedInformed, setApprovedInformed] = useState(false)
  const [autopilotRules, setAutopilotRules] = useState<readonly RuleId[]>([])
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const approve = useCallback(() => {
    clearTimeout(timer.current)
    setApprovedInformed(learned.includes(LESSON_ID))
    setSuggestion("placing")
    timer.current = setTimeout(() => setSuggestion("done"), PLACING_MS)
  }, [learned])

  const skip = useCallback(() => {
    clearTimeout(timer.current)
    setSuggestion("skipped")
  }, [])

  const reset = useCallback(() => {
    clearTimeout(timer.current)
    setSuggestion("pending")
    setMode(autonomy.current)
    setLearned(initialLearned(variant))
    setApprovedInformed(false)
    setAutopilotRules([])
  }, [variant])

  const completeLesson = useCallback(
    (id: ConceptId) =>
      setLearned((current) =>
        current.includes(id) ? current : [...current, id],
      ),
    [],
  )

  const setRuleAutopilot = useCallback(
    (id: RuleId, on: boolean) =>
      setAutopilotRules((current) => {
        const rest = current.filter((rule) => rule !== id)
        return on ? [...rest, id] : rest
      }),
    [],
  )

  const value = useMemo(
    () => ({
      variant,
      persona,
      suggestion,
      mode,
      learned,
      approvedInformed,
      autopilotRules,
      approve,
      skip,
      reset,
      setMode,
      completeLesson,
      setRuleAutopilot,
    }),
    [
      variant,
      persona,
      suggestion,
      mode,
      learned,
      approvedInformed,
      autopilotRules,
      approve,
      skip,
      reset,
      completeLesson,
      setRuleAutopilot,
    ],
  )

  return <DemoContext value={value}>{children}</DemoContext>
}

export function useDemo() {
  const value = use(DemoContext)
  if (!value) throw new Error("useDemo must be used inside DemoStateProvider")
  return value
}
