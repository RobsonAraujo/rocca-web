import { learn } from "../data"
import type { Variant } from "../demo-state"
import type { ConceptId } from "./data"
import { DEFAULT_LEARNED, concepts } from "./data"

/**
 * Lessons done, for the rings. The regular preview keeps the landing's
 * 3 of 12 (plus anything learned since); a brand-new account counts the
 * concepts of its own course.
 */
export function learnSummary(variant: Variant, learned: readonly ConceptId[]) {
  if (variant === "firstRun") {
    return { done: learned.length, total: concepts.length }
  }
  const extra = learned.filter((id) => !DEFAULT_LEARNED.includes(id)).length
  return { done: learn.progress.done + extra, total: learn.progress.total }
}

/** The first concept of the course not learned yet, if any. */
export function nextConcept(learned: readonly ConceptId[]) {
  return concepts.find((concept) => !learned.includes(concept.id)) ?? null
}
