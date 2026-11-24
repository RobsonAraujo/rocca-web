import type { Variant } from "../demo-state"
import type { ConceptId } from "./data"
import { concepts } from "./data"

/**
 * Lessons done, for the rings: one lesson per concept of the course. The
 * regular preview starts at 3 of 5 (the landing's Learn card says the
 * same); a brand-new account starts at 0.
 */
export function learnSummary(learned: readonly ConceptId[]) {
  return { done: learned.length, total: concepts.length }
}

/** Minutes of lessons still to take. */
export function minutesLeft(learned: readonly ConceptId[]) {
  return concepts
    .filter((concept) => !learned.includes(concept.id))
    .reduce((sum, concept) => sum + concept.minutes, 0)
}

/**
 * Days in a row with a lesson. Simulated: the regular preview has been at
 * it for a while; a brand-new account starts its streak with its first
 * lesson.
 */
export function streakDays(variant: Variant, learned: readonly ConceptId[]) {
  if (variant === "default") return 6
  return learned.length > 0 ? 1 : 0
}

/** The first concept of the course not learned yet, if any. */
export function nextConcept(learned: readonly ConceptId[]) {
  return concepts.find((concept) => !learned.includes(concept.id)) ?? null
}
