"use client"

import { Popover } from "@base-ui/react/popover"
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  FlameIcon,
  GraduationCapIcon,
  LayersIcon,
  LockIcon,
  LockOpenIcon,
  ScanSearchIcon,
  SparklesIcon,
} from "lucide-react"
import { Fragment, useState } from "react"

import { Button } from "@/components/ui/button"
import { toneClasses } from "@/components/product/tone"
import { illustrations } from "@/features/landing/content"
import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { SimulatedBadge } from "../components/navigation"
import { rules } from "../data"
import { useDemo } from "../demo-state"
import { holdings } from "../portfolio/data"
import { ruleAutopilot } from "../widgets/rule-autopilot"
import type { Concept, ConceptId } from "./data"
import { LESSON_ID, concepts, learnPage, units } from "./data"
import { openLesson } from "./open-lesson"
import { learnSummary, minutesLeft, nextConcept, streakDays } from "./progress"

type NodeState = "learned" | "current" | "locked"
type UnitTone = (typeof units)[number]["tone"]

/** Where each lesson sits on the path: a gentle wave, like Duolingo's. */
const WAVE = [0, 64, 96, 64, 0, -64, -96, -64]

const position = (id: ConceptId) => concepts.findIndex((c) => c.id === id)

/** Solid, "pressable" nodes: a darker lip below, that sinks when pressed. */
const nodeTone: Record<UnitTone | "locked", string> = {
  learn:
    "bg-learn text-white shadow-[0_6px_0_0_color-mix(in_oklab,var(--color-learn)_62%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-learn)_62%,black)]",
  brand:
    "bg-brand text-white shadow-[0_6px_0_0_color-mix(in_oklab,var(--color-brand)_62%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-brand)_62%,black)]",
  locked:
    "bg-secondary text-muted-foreground shadow-[0_6px_0_0_var(--color-border)] active:shadow-[0_2px_0_0_var(--color-border)]",
}

function useCourse() {
  const demo = useDemo()
  const next = nextConcept(demo.learned)
  const stateOf = (id: ConceptId): NodeState =>
    demo.learned.includes(id)
      ? "learned"
      : id === next?.id
        ? "current"
        : "locked"
  return { ...demo, next, stateOf }
}

/**
 * The top of the page: this course was made from your money. The pipeline
 * (accounts read → holdings checked → lessons) shows how, in numbers.
 */
function CourseHero() {
  const { persona, variant, learned } = useCourse()
  const steps = [
    {
      icon: LayersIcon,
      value: illustrations.accounts.length,
      label: learnPage.pipeline.accounts,
    },
    {
      icon: ScanSearchIcon,
      value: holdings.length,
      label: learnPage.pipeline.holdings,
    },
    {
      icon: GraduationCapIcon,
      value: concepts.length,
      label: learnPage.pipeline.lessons,
    },
  ]
  const streak = streakDays(variant, learned)
  const total = concepts.reduce((sum, c) => sum + c.minutes, 0)
  return (
    <section
      aria-labelledby="course-title"
      className="relative overflow-hidden rounded-3xl bg-linear-to-br from-learn/[0.12] via-card to-brand/[0.08] p-6 ring-1 ring-learn/15 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            toneClasses.learn.tile,
          )}
        >
          <SparklesIcon className="size-3.5" aria-hidden />
          {learnPage.badge}
        </p>
        <SimulatedBadge className="w-fit xl:hidden" />
      </div>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-xl">
          <h1
            id="course-title"
            className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {learnPage.title(persona?.name ?? null)}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {learnPage.intro}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 ring-1 ring-border">
              <ClockIcon className="size-3.5 text-learn" aria-hidden />
              {learnPage.minutes(total)}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 ring-1 ring-border">
              <FlameIcon
                className={cn(
                  "size-3.5",
                  streak > 0 ? "text-attention" : "text-muted-foreground",
                )}
                aria-hidden
              />
              {learnPage.streak(streak)}
            </li>
          </ul>
        </div>

        <ol
          aria-label={learnPage.pipeline.label}
          className="flex items-stretch gap-1.5 sm:gap-2"
        >
          {steps.map(({ icon: Icon, value, label }, index) => (
            <Fragment key={label}>
              {index > 0 && (
                <li aria-hidden className="flex items-center">
                  <ArrowRightIcon className="size-4 text-learn/60" />
                </li>
              )}
              <li className="flex min-w-0 flex-1 flex-col rounded-2xl bg-card/80 px-3 py-3 ring-1 ring-border backdrop-blur sm:w-28 sm:flex-none sm:px-4">
                <Icon className="size-4 text-learn" aria-hidden />
                <span className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                  {value}
                </span>
                <span className="text-[11px] leading-tight text-muted-foreground">
                  {label}
                </span>
              </li>
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** The card a lesson opens on the path: what it is, where it comes from, what it unlocks. */
function LessonCard({
  concept,
  state,
  tone,
  onStart,
}: {
  concept: Concept
  state: NodeState
  tone: UnitTone
  onStart: () => void
}) {
  const learned = state === "learned"
  const button = {
    className: cn(
      "mt-4 h-10 w-full rounded-xl text-sm font-semibold",
      learned ? "" : toneClasses[tone].solid,
    ),
    variant: learned ? ("outline" as const) : ("default" as const),
    children: learned ? learnPage.review : learnPage.start,
  }
  return (
    <>
      <p className="text-xs font-medium text-muted-foreground">
        {learnPage.lessonOf(
          position(concept.id) + 1,
          concepts.length,
          concept.minutes,
        )}
      </p>
      <Popover.Title className="mt-1 text-base leading-snug font-semibold tracking-tight text-balance">
        {concept.title}
      </Popover.Title>
      <dl className="mt-3 space-y-2.5 text-[13px]">
        <div>
          <dt className="text-xs text-muted-foreground">{learnPage.tie}</dt>
          <dd className="mt-0.5 flex items-start gap-1.5 text-pretty">
            <SparklesIcon
              className="mt-0.5 size-3.5 shrink-0 text-learn"
              aria-hidden
            />
            {concept.tie}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{learnPage.unlocks}</dt>
          <dd className="mt-0.5 flex items-start gap-1.5 text-pretty">
            <LockOpenIcon
              className="mt-0.5 size-3.5 shrink-0 text-control"
              aria-hidden
            />
            {concept.unlocks}
          </dd>
        </div>
      </dl>
      {concept.playable ? (
        <Button type="button" onClick={onStart} {...button} />
      ) : (
        <ComingSoonButton {...button} />
      )}
    </>
  )
}

/** One stop on the path: the round node, its name, and where it comes from. */
function LessonNode({
  concept,
  state,
  tone,
  open,
  onOpenChange,
}: {
  concept: Concept
  state: NodeState
  tone: UnitTone
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const Icon = concept.icon
  const offset = WAVE[position(concept.id) % WAVE.length]!
  const current = state === "current"
  return (
    <li id={concept.id} className="flex scroll-mt-24 justify-center">
      <div
        style={{ "--offset": `${offset}px` } as React.CSSProperties}
        className="flex translate-x-[calc(var(--offset)*0.5)] flex-col items-center sm:translate-x-(--offset)"
      >
        {current && (
          <span
            aria-hidden
            className={cn(
              "relative mb-3 animate-float rounded-xl bg-card px-3 py-1.5 text-xs font-bold tracking-wide uppercase shadow-soft ring-1 ring-border motion-reduce:animate-none",
              toneClasses[tone].text,
            )}
          >
            {concept.playable ? learnPage.bubble.start : learnPage.bubble.next}
            <span className="absolute top-full left-1/2 -mt-1 size-2.5 -translate-x-1/2 rotate-45 border-r border-b border-border bg-card" />
          </span>
        )}
        <Popover.Root open={open} onOpenChange={onOpenChange}>
          <span
            className={cn(
              "rounded-full",
              current &&
                cn(
                  "p-2 ring-4",
                  toneClasses[tone].soft,
                  toneClasses[tone].ring,
                ),
            )}
          >
            <Popover.Trigger
              aria-label={`${concept.label}, ${learnPage.status[state === "current" ? "next" : state === "learned" ? "learned" : "notStarted"]}`}
              className={cn(
                "relative grid size-18 place-items-center rounded-full transition-[translate,box-shadow] duration-100 outline-none focus-visible:ring-4 focus-visible:ring-ring/50 active:translate-y-1 motion-reduce:transition-none",
                nodeTone[state === "locked" ? "locked" : tone],
              )}
            >
              <Icon className="size-7" aria-hidden />
              {state === "learned" && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute -right-1 -bottom-1 grid size-7 place-items-center rounded-full bg-card ring-2 ring-card",
                    toneClasses[tone].text,
                  )}
                >
                  <CheckIcon className="size-4" strokeWidth={3} />
                </span>
              )}
              {state === "locked" && (
                <span
                  aria-hidden
                  className="absolute -right-1 -bottom-1 grid size-6 place-items-center rounded-full bg-card text-muted-foreground ring-2 ring-card"
                >
                  <LockIcon className="size-3" />
                </span>
              )}
            </Popover.Trigger>
          </span>
          <Popover.Portal>
            <Popover.Positioner side="bottom" sideOffset={14}>
              <Popover.Popup className="w-72 origin-(--transform-origin) rounded-2xl bg-card p-4 text-foreground shadow-float ring-1 ring-border transition-[scale,opacity] duration-150 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
                <LessonCard
                  concept={concept}
                  state={state}
                  tone={tone}
                  onStart={() => {
                    onOpenChange(false)
                    openLesson()
                  }}
                />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>

        <p
          className={cn(
            "mt-4 text-sm font-semibold",
            state === "locked" && "text-muted-foreground",
          )}
        >
          {concept.label}
        </p>
        {/* Where this lesson comes from: the heart of a course built from your money. */}
        <p className="mt-1.5 inline-flex max-w-64 items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-xs whitespace-nowrap shadow-soft ring-1 ring-border">
          <span className="font-semibold">{concept.source.label}</span>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <span className="truncate text-muted-foreground">
            {concept.source.detail}
          </span>
        </p>
      </div>
    </li>
  )
}

/** The path: units as colored banners, lessons as stops on a wave. */
function CoursePath() {
  const { stateOf, learned } = useCourse()
  const [openId, setOpenId] = useState<ConceptId | null>(null)
  return (
    <section aria-label={learnPage.path} className="space-y-10">
      {units.map((unit, index) => {
        const done = unit.concepts.filter((id) => learned.includes(id)).length
        return (
          <div key={unit.id} className="space-y-8">
            <div
              className={cn(
                "flex items-center justify-between gap-4 rounded-2xl p-5 text-white",
                unit.tone === "learn" ? "bg-learn" : "bg-brand",
              )}
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-white/80 uppercase">
                  {learnPage.unit(index + 1)}
                </p>
                <h2 className="mt-0.5 text-lg font-semibold tracking-tight">
                  {unit.title}
                </h2>
                <p className="mt-0.5 text-sm text-pretty text-white/85">
                  {unit.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold tabular-nums">
                {done}/{unit.concepts.length}
              </span>
            </div>
            <ol className="space-y-9">
              {unit.concepts.map((id) => (
                <LessonNode
                  key={id}
                  concept={concepts[position(id)]!}
                  state={stateOf(id)}
                  tone={unit.tone}
                  open={openId === id}
                  onOpenChange={(open) => setOpenId(open ? id : null)}
                />
              ))}
            </ol>
          </div>
        )
      })}
    </section>
  )
}

const cardClass = "rounded-2xl bg-card p-5 ring-1 ring-border"

function ProgressCard() {
  const { learned, variant, next } = useCourse()
  const { done, total } = learnSummary(learned)
  const streak = streakDays(variant, learned)
  return (
    <section aria-labelledby="progress-title" className={cardClass}>
      <h2 id="progress-title" className="text-sm font-semibold">
        {learnPage.progress.title}
      </h2>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
        {done}
        <span className="text-base font-normal text-muted-foreground">
          /{total}
        </span>
      </p>
      <p className="text-xs text-muted-foreground">
        {learnPage.progress.lessons(done, total)}
      </p>
      <div
        role="progressbar"
        aria-label="Lessons completed"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="mt-3 flex gap-1"
      >
        {/* Fills left to right, whatever order the lessons were taken in. */}
        {concepts.map((concept, index) => (
          <span
            key={concept.id}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors",
              index < done ? "bg-learn" : "bg-secondary",
            )}
          />
        ))}
      </div>
      <dl className="mt-4 space-y-2 border-t border-border pt-4 text-[13px]">
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <ClockIcon className="size-3.5" aria-hidden />
            {learnPage.progress.left(minutesLeft(learned))}
          </dt>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <FlameIcon
              className={cn(
                "size-3.5",
                streak > 0 ? "text-attention" : "text-muted-foreground",
              )}
              aria-hidden
            />
            {learnPage.streak(streak)}
          </dt>
        </div>
        {next && (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">{learnPage.progress.next}</dt>
            <dd className="font-medium">{next.label}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}

/** What each lesson lets Rocca take on: the rewards are real. */
function RewardsCard() {
  const demo = useCourse()
  const statusOf = (concept: Concept) => {
    if (concept.id === LESSON_ID) {
      const state = ruleAutopilot(demo, rules.autopilot.ruleId)
      if (state === "locked")
        return { open: false, text: learnPage.rewards.locked(concept.label) }
      return { open: true, text: learnPage.rewards[state] }
    }
    return demo.learned.includes(concept.id)
      ? { open: true, text: learnPage.rewards.unlocked }
      : { open: false, text: learnPage.rewards.locked(concept.label) }
  }
  return (
    <section aria-labelledby="rewards-title" className={cardClass}>
      <h2 id="rewards-title" className="text-sm font-semibold">
        {learnPage.rewards.title}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-pretty text-muted-foreground">
        {learnPage.rewards.description}
      </p>
      <ul className="mt-4 space-y-3">
        {concepts.map((concept) => {
          const { open, text } = statusOf(concept)
          const Icon = open ? LockOpenIcon : LockIcon
          return (
            <li key={concept.id} className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-lg",
                  open
                    ? toneClasses.control.tile
                    : "bg-secondary text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] leading-snug font-medium text-pretty">
                  {concept.unlocks}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    open ? "text-control" : "text-muted-foreground",
                  )}
                >
                  {text}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/**
 * /preview/learn: the course Rocca builds from what you own, laid out as a
 * path (Duolingo-style). Each stop says which holding it comes from; tap
 * it for the lesson, where it comes from and what it unlocks. Only
 * Concentration plays; the rest show the coming-soon notice.
 */
export function LearnPage() {
  return (
    <>
      <CourseHero />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        <div className="mx-auto w-full max-w-xl py-2">
          <CoursePath />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24">
          <ProgressCard />
          <RewardsCard />
        </aside>
      </div>
    </>
  )
}
