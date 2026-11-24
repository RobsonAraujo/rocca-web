"use client"

import {
  ChevronRightIcon,
  CircleCheckIcon,
  GraduationCapIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { toneClasses } from "@/components/product/tone"
import { cn } from "@/lib/utils"

import { lessonPanel, reasoningPanel } from "../components/side-panel"
import { suggestion } from "../data"
import { useDemo } from "../demo-state"
import { controlsSheet, lessonSheet, whySheet } from "../mobile/sheet"
import { LESSON_ID } from "./data"

/**
 * Tablets and desktop use side panels, phones use bottom sheets (the md
 * breakpoint). jsdom has no matchMedia, so tests get the desktop panel.
 */
export function isWide() {
  return (
    typeof window.matchMedia !== "function" ||
    window.matchMedia("(min-width: 48rem)").matches
  )
}

/**
 * Opens the lesson from anywhere: first closes whatever it was opened from
 * (the reasoning panel, the Why? sheet, the controls sheet), so two drawers
 * never stack.
 */
export function openLesson() {
  reasoningPanel.close()
  whySheet.close()
  controlsSheet.close()
  ;(isWide() ? lessonPanel : lessonSheet).open(null)
}

/** "Set it up" after an informed approval: show the rule's Autopilot switch. */
export function showAutopilot() {
  if (isWide()) {
    document
      .getElementById("autonomy")
      ?.scrollIntoView?.({ behavior: "smooth", block: "center" })
  } else {
    controlsSheet.open(null)
  }
}

type LessonButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick" | "type"
>

/** A regular Button that opens the Concentration lesson. */
export function LessonButton(props: LessonButtonProps) {
  return <Button type="button" {...props} onClick={openLesson} />
}

/**
 * On the decision card, before Approve (first run only): learn why first.
 * Prominent for beginners; a quiet link for people who said they're
 * experienced. Once learned, it says so and offers a review.
 */
export function LessonPrompt({ className }: { className?: string }) {
  const { variant, persona, learned, suggestion: status } = useDemo()
  if (variant !== "firstRun" || status !== "pending") return null

  if (learned.includes(LESSON_ID)) {
    return (
      <p
        className={cn(
          "flex items-center gap-1.5 text-[13px] font-medium",
          toneClasses.learn.text,
          className,
        )}
      >
        <CircleCheckIcon className="size-4 shrink-0" aria-hidden />
        {suggestion.lessonDone}
        <span aria-hidden className="text-muted-foreground">
          ·
        </span>
        <button
          type="button"
          onClick={openLesson}
          className="rounded-sm underline-offset-2 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {suggestion.lessonReview}
        </button>
      </p>
    )
  }

  if (!persona?.explainSimply) {
    return (
      <button
        type="button"
        onClick={openLesson}
        className={cn(
          "flex items-center gap-1.5 rounded-sm text-[13px] font-medium outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50",
          toneClasses.learn.text,
          className,
        )}
      >
        <GraduationCapIcon className="size-4 shrink-0" aria-hidden />
        {suggestion.lessonShort}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={openLesson}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg p-3 text-left ring-1 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        toneClasses.learn.soft,
        toneClasses.learn.ring,
        "hover:bg-learn/10",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-lg",
          toneClasses.learn.tile,
        )}
      >
        <GraduationCapIcon className="size-[1.125rem]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{suggestion.lesson}</span>
        <span className="mt-0.5 block text-xs text-pretty text-muted-foreground">
          {suggestion.lessonHint}
        </span>
      </span>
      <ChevronRightIcon
        className={cn("size-4 shrink-0", toneClasses.learn.text)}
        aria-hidden
      />
    </button>
  )
}
