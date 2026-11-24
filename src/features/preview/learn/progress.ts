import type { Variant } from "../demo-state"
import type { ConceptId } from "./data"
import { DEFAULT_LEARNED, concepts } from "./data"

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

/** Whether a lesson was finished in this visit ("today"). */
export function learnedToday(variant: Variant, learned: readonly ConceptId[]) {
  return variant === "firstRun"
    ? learned.length > 0
    : learned.some((id) => !DEFAULT_LEARNED.includes(id))
}

/**
 * Days in a row with a lesson. Simulated: the regular preview has a
 * 6-day run going into today; a brand-new account starts its streak with
 * its first lesson. Either way, a lesson today adds a day.
 */
export function streakDays(variant: Variant, learned: readonly ConceptId[]) {
  const today = learnedToday(variant, learned) ? 1 : 0
  return (variant === "default" ? 6 : 0) + today
}

/** The week on the streak card, Monday to Sunday; today is Sunday. */
export const WEEK = ["M", "T", "W", "T", "F", "S", "S"] as const

/** Which days of the week had a lesson, ending today. */
export function streakWeek(variant: Variant, learned: readonly ConceptId[]) {
  const today = learnedToday(variant, learned)
  const before = variant === "default" ? 6 : 0
  return WEEK.map((label, index) => {
    const isToday = index === WEEK.length - 1
    return {
      label,
      today: isToday,
      done: isToday ? today : index >= WEEK.length - 1 - before,
    }
  })
}

/** XP: every lesson is worth the same. */
export const XP_PER_LESSON = 20

/**
 * Levels, named for how much of their money people understand. The top
 * one needs the whole course (5 lessons × 20 XP).
 */
export const levels = [
  { level: 1, name: "Curious", xp: 0 },
  { level: 2, name: "Informed", xp: 40 },
  { level: 3, name: "Confident", xp: 80 },
  { level: 4, name: "In control", xp: 100 },
] as const

export function xpFor(learned: readonly ConceptId[]) {
  return learned.length * XP_PER_LESSON
}

/** The level an XP total reaches, the next one, and how far along it is. */
export function levelFor(xp: number) {
  let index = 0
  levels.forEach((level, i) => {
    if (xp >= level.xp) index = i
  })
  const current = levels[index]!
  const next = levels[index + 1] ?? null
  const progress = next ? (xp - current.xp) / (next.xp - current.xp) : 1
  return { current, next, progress, toNext: next ? next.xp - xp : 0 }
}

/** The first concept of the course not learned yet, if any. */
export function nextConcept(learned: readonly ConceptId[]) {
  return concepts.find((concept) => !learned.includes(concept.id)) ?? null
}
