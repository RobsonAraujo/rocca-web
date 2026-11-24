import type { LucideIcon } from "lucide-react"
import {
  FlameIcon,
  GraduationCapIcon,
  LayersIcon,
  LightbulbIcon,
  LockOpenIcon,
  MedalIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from "lucide-react"

import type { Tone } from "@/components/product/tone"

import type { ConceptId } from "./data"
import { concepts, units } from "./data"

/**
 * Badges for the Learn page. They reward understanding and control (a
 * lesson, deciding with the facts, earning a rule), never trading itself:
 * gamifying trades is what regulators frown on.
 */

export type AchievementContext = {
  learned: readonly ConceptId[]
  /** The trim was approved after its lesson. */
  approvedInformed: boolean
  /** Autopilot for the 12% rule is unlocked (ready or on). */
  ruleEarned: boolean
  streak: number
}

type Achievement = {
  id: string
  label: string
  description: string
  icon: LucideIcon
  tone: Tone
  earned: (context: AchievementContext) => boolean
}

const unitDone = (index: number, learned: readonly ConceptId[]) =>
  units[index]!.concepts.every((id) => learned.includes(id))

export const achievements = [
  {
    id: "full-picture",
    label: "Full picture",
    description: "Connected all your accounts",
    icon: LayersIcon,
    tone: "brand",
    // Both the demo and the regular preview have every account connected.
    earned: () => true,
  },
  {
    id: "first-lesson",
    label: "First lesson",
    description: "Finished a lesson",
    icon: GraduationCapIcon,
    tone: "learn",
    earned: ({ learned }) => learned.length > 0,
  },
  {
    id: "knows-why",
    label: "Knows why",
    description: "Learned the concept before deciding",
    icon: LightbulbIcon,
    tone: "learn",
    earned: ({ approvedInformed }) => approvedInformed,
  },
  {
    id: "rule-earned",
    label: "Rule earned",
    description: "Unlocked Autopilot for a rule",
    icon: LockOpenIcon,
    tone: "control",
    earned: ({ ruleEarned }) => ruleEarned,
  },
  {
    id: "owns-it",
    label: "Owns it",
    description: `Finished Unit 1: ${units[0].title}`,
    icon: TrophyIcon,
    tone: "attention",
    earned: ({ learned }) => unitDone(0, learned),
  },
  {
    id: "costs-cut",
    label: "Costs in check",
    description: `Finished Unit 2: ${units[1].title}`,
    icon: ShieldCheckIcon,
    tone: "attention",
    earned: ({ learned }) => unitDone(1, learned),
  },
  {
    id: "on-a-roll",
    label: "On a roll",
    description: "7 days of learning in a row",
    icon: FlameIcon,
    tone: "attention",
    earned: ({ streak }) => streak >= 7,
  },
  {
    id: "in-control",
    label: "In control",
    description: "Finished the whole course",
    icon: MedalIcon,
    tone: "control",
    earned: ({ learned }) => learned.length === concepts.length,
  },
] as const satisfies readonly Achievement[]

/** Every badge, with whether it's earned. */
export function earnedAchievements(context: AchievementContext) {
  return achievements.map((achievement) => ({
    ...achievement,
    done: achievement.earned(context),
  }))
}

/** The trophy at the end of each unit is that unit's badge. */
export const unitTrophies = ["owns-it", "costs-cut"] as const
