"use client"

import { Popover } from "@base-ui/react/popover"
import {
  ArrowRightIcon,
  CheckIcon,
  CircleCheckIcon,
  ClockIcon,
  FlameIcon,
  GraduationCapIcon,
  LayersIcon,
  LockIcon,
  LockOpenIcon,
  ScanSearchIcon,
  SparklesIcon,
  TargetIcon,
  TrophyIcon,
  ZapIcon,
} from "lucide-react"
import { Fragment, useState } from "react"

import { Button } from "@/components/ui/button"
import type { Tone } from "@/components/product/tone"
import { toneClasses } from "@/components/product/tone"
import { illustrations } from "@/features/landing/content"
import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { SimulatedBadge } from "../components/navigation"
import { rules } from "../data"
import { useDemo } from "../demo-state"
import { holdings } from "../portfolio/data"
import { ruleAutopilot } from "../widgets/rule-autopilot"
import { achievements, earnedAchievements, unitTrophies } from "./achievements"
import type { Concept, ConceptId } from "./data"
import { LESSON_ID, concepts, learnPage, units } from "./data"
import { openLesson } from "./open-lesson"
import { PortfolioLink } from "./portfolio-link"
import {
  XP_PER_LESSON,
  learnSummary,
  learnedToday,
  levelFor,
  minutesLeft,
  nextConcept,
  streakDays,
  streakWeek,
  xpFor,
} from "./progress"

type NodeState = "learned" | "current" | "locked"
type UnitTone = (typeof units)[number]["tone"]

/**
 * Stops alternate left and right of the center line, so each one has room
 * for its portfolio card on the other side.
 */
const SWING = 72

const position = (id: ConceptId) => concepts.findIndex((c) => c.id === id)

/**
 * Chunky, pressable tiles (lesson nodes, trophies, badges): a darker "lip"
 * below that sinks when pressed. Full class names, so Tailwind sees them.
 */
const solidTile: Record<Tone | "locked", string> = {
  learn:
    "bg-learn text-white shadow-[0_6px_0_0_color-mix(in_oklab,var(--color-learn)_62%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-learn)_62%,black)]",
  brand:
    "bg-brand text-white shadow-[0_6px_0_0_color-mix(in_oklab,var(--color-brand)_62%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-brand)_62%,black)]",
  attention:
    "bg-attention text-white shadow-[0_6px_0_0_color-mix(in_oklab,var(--color-attention)_62%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-attention)_62%,black)]",
  control:
    "bg-control text-white shadow-[0_6px_0_0_color-mix(in_oklab,var(--color-control)_62%,black)] active:shadow-[0_2px_0_0_color-mix(in_oklab,var(--color-control)_62%,black)]",
  locked:
    "bg-secondary text-muted-foreground shadow-[0_6px_0_0_var(--color-border)] active:shadow-[0_2px_0_0_var(--color-border)]",
}

/** Everything the page shows, from the demo state. */
function useCourse() {
  const demo = useDemo()
  const { variant, learned } = demo
  const next = nextConcept(learned)
  const streak = streakDays(variant, learned)
  const ruleState = ruleAutopilot(demo, rules.autopilot.ruleId)
  const badges = earnedAchievements({
    learned,
    approvedInformed: demo.approvedInformed,
    ruleEarned: ruleState === "ready" || ruleState === "on",
    streak,
  })
  const stateOf = (id: ConceptId): NodeState =>
    learned.includes(id) ? "learned" : id === next?.id ? "current" : "locked"
  return {
    ...demo,
    next,
    stateOf,
    streak,
    ruleState,
    badges,
    xp: xpFor(learned),
  }
}

/** The level mark: a chunky tile with the number, like a game's. */
function LevelBadge({ level }: { level: number }) {
  return (
    <span
      aria-hidden
      className="relative grid size-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-learn to-control text-3xl font-bold text-white shadow-[0_5px_0_0_color-mix(in_oklab,var(--color-control)_60%,black)]"
    >
      {level}
      <SparklesIcon className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-card p-0.5 text-attention" />
    </span>
  )
}

/** Level, XP and how far to the next level. */
function LevelCard() {
  const { xp } = useCourse()
  const { current, next, progress, toNext } = levelFor(xp)
  return (
    <section
      aria-label={learnPage.level.label(current.level)}
      className="w-full rounded-2xl bg-card/90 p-5 shadow-soft ring-1 ring-border backdrop-blur lg:w-80"
    >
      <div className="flex items-center gap-4">
        <LevelBadge key={current.level} level={current.level} />
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">
            {learnPage.level.label(current.level)}
          </p>
          <p className="text-xl font-semibold tracking-tight">{current.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-attention">
            <ZapIcon className="size-3.5 fill-current" aria-hidden />
            {learnPage.level.xp(xp)}
          </p>
        </div>
      </div>
      <div
        role="progressbar"
        aria-label="XP to the next level"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="mt-4 h-3 overflow-hidden rounded-full bg-secondary"
      >
        <span
          className="block h-full rounded-full bg-linear-to-r from-learn to-control transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${Math.max(progress, 0.04) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {next
          ? learnPage.level.toNext(toNext, next.level)
          : learnPage.level.max}
      </p>
    </section>
  )
}

/**
 * The top of the page: this course was made from your money. The pipeline
 * (accounts read → holdings checked → lessons) shows how, in numbers; the
 * level card shows where you are.
 */
function CourseHero() {
  const { persona } = useCourse()
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
  return (
    <section
      aria-labelledby="course-title"
      className="relative overflow-hidden rounded-3xl bg-linear-to-br from-learn/[0.12] via-card to-control/[0.08] p-6 ring-1 ring-learn/15 sm:p-8"
    >
      {/* Soft shapes in the corners, for depth. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-learn/10 blur-2xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/3 size-48 rounded-full bg-attention/10 blur-2xl"
      />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
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
          <h1
            id="course-title"
            className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {learnPage.title(persona?.name ?? null)}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {learnPage.intro}
          </p>

          <ol
            aria-label={learnPage.pipeline.label}
            className="mt-6 flex items-stretch gap-1.5 sm:gap-2"
          >
            {steps.map(({ icon: Icon, value, label }, index) => (
              <Fragment key={label}>
                {index > 0 && (
                  <li aria-hidden className="flex items-center">
                    <ArrowRightIcon className="size-4 text-learn/60" />
                  </li>
                )}
                <li className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl bg-card/80 px-3 py-2.5 ring-1 ring-border backdrop-blur sm:flex-none sm:px-3.5">
                  <Icon className="size-4 shrink-0 text-learn" aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-lg leading-tight font-semibold tabular-nums">
                      {value}
                    </span>
                    <span className="block text-[11px] leading-tight text-muted-foreground">
                      {label}
                    </span>
                  </span>
                </li>
              </Fragment>
            ))}
          </ol>
        </div>

        <LevelCard />
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
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">
          {learnPage.lessonOf(
            position(concept.id) + 1,
            concepts.length,
            concept.minutes,
          )}
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-attention/10 px-2 py-0.5 text-[11px] font-bold text-attention">
          <ZapIcon className="size-3 fill-current" aria-hidden />
          {learnPage.celebrate.xp(XP_PER_LESSON)}
        </span>
      </div>
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
  const offset = position(concept.id) % 2 === 0 ? -SWING : SWING
  const current = state === "current"
  const statusLabel =
    learnPage.status[
      state === "current"
        ? "next"
        : state === "learned"
          ? "learned"
          : "notStarted"
    ]
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
              "relative rounded-full",
              current &&
                cn(
                  "p-2 ring-4",
                  toneClasses[tone].soft,
                  toneClasses[tone].ring,
                ),
            )}
          >
            <Popover.Trigger
              aria-label={`${concept.label}, ${statusLabel}`}
              className={cn(
                "relative grid size-18 place-items-center rounded-full transition-[translate,box-shadow] duration-100 outline-none focus-visible:ring-4 focus-visible:ring-ring/50 active:translate-y-1 motion-reduce:transition-none",
                solidTile[state === "locked" ? "locked" : tone],
              )}
            >
              <Icon className="size-7" aria-hidden />
              {state === "learned" && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute -right-1 -bottom-1 grid size-7 animate-pop place-items-center rounded-full bg-card ring-2 ring-card",
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
            {/* Tablets and desktop: the data this lesson comes from, wired to the stop. */}
            <PortfolioLink
              id={concept.id}
              side={offset < 0 ? "right" : "left"}
              state={state}
              tone={tone}
              className="hidden sm:block"
            />
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
        {/* Phones: where this lesson comes from, in short (wider screens get the card). */}
        <p className="mt-1.5 inline-flex max-w-64 items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-xs whitespace-nowrap shadow-soft ring-1 ring-border sm:hidden">
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

/** The trophy closing a unit: that unit's badge, lit once it's done. */
function UnitTrophy({
  unit,
  badge,
  earned,
}: {
  unit: number
  badge: string
  earned: boolean
}) {
  const text = earned
    ? learnPage.trophy.earned(badge)
    : learnPage.trophy.hint(badge)
  return (
    <li className="flex justify-center">
      <div className="flex flex-col items-center text-center">
        <span
          role="img"
          aria-label={`${learnPage.trophy.label(unit)}: ${text}`}
          className={cn(
            "grid size-16 place-items-center rounded-2xl",
            earned ? cn(solidTile.attention, "animate-pop") : solidTile.locked,
          )}
        >
          <TrophyIcon className="size-7" aria-hidden />
        </span>
        <p className="mt-3 text-xs font-semibold">
          {learnPage.trophy.label(unit)}
        </p>
        <p
          className={cn(
            "mt-0.5 text-xs",
            earned ? "font-medium text-attention" : "text-muted-foreground",
          )}
        >
          {text}
        </p>
      </div>
    </li>
  )
}

/** The path: units as colored banners, lessons as stops on a wave, a trophy per unit. */
function CoursePath() {
  const { stateOf, learned, badges } = useCourse()
  const [openId, setOpenId] = useState<ConceptId | null>(null)
  return (
    <section aria-label={learnPage.path} className="space-y-10">
      {units.map((unit, index) => {
        const done = unit.concepts.filter((id) => learned.includes(id)).length
        const trophy = badges.find((b) => b.id === unitTrophies[index])!
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
            {/* Wider gaps from tablets up: the portfolio cards are taller than the stops. */}
            <ol className="space-y-9 sm:space-y-24">
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
              <UnitTrophy
                key={`${trophy.id}-${trophy.done}`}
                unit={index + 1}
                badge={trophy.label}
                earned={trophy.done}
              />
            </ol>
          </div>
        )
      })}
    </section>
  )
}

const cardClass = "rounded-2xl bg-card p-5 ring-1 ring-border"

/** Duolingo's streak: the number, the week with flames, today's goal. */
function StreakCard() {
  const { variant, learned, streak } = useCourse()
  const week = streakWeek(variant, learned)
  const goalDone = learnedToday(variant, learned)
  return (
    <section aria-labelledby="streak-title" className={cardClass}>
      <h2 id="streak-title" className="sr-only">
        {learnPage.week.title}
      </h2>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "grid size-12 place-items-center rounded-2xl",
            streak > 0
              ? "bg-attention/10 text-attention"
              : "bg-secondary text-muted-foreground",
          )}
        >
          <FlameIcon
            className={cn("size-7", streak > 0 && "fill-attention/25")}
          />
        </span>
        <div>
          <p
            key={streak}
            className="animate-pop text-3xl leading-none font-semibold tracking-tight tabular-nums"
          >
            {streak}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {learnPage.streak(streak)}
          </p>
        </div>
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-1">
        {week.map((day, index) => (
          <li key={index} className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "grid size-8 place-items-center rounded-full",
                day.done
                  ? "bg-attention text-white"
                  : day.today
                    ? "text-attention ring-2 ring-attention/40"
                    : "bg-secondary",
              )}
            >
              {day.done && (
                <FlameIcon className="size-4 fill-white/30" aria-hidden />
              )}
              <span className="sr-only">
                {day.today ? learnPage.week.today : day.label}:{" "}
                {day.done ? learnPage.week.done : learnPage.week.missed}
              </span>
            </span>
            <span
              aria-hidden
              className={cn(
                "text-[11px]",
                day.today
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {day.label}
            </span>
          </li>
        ))}
      </ol>
      <p
        className={cn(
          "mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-xs font-medium",
          goalDone ? "text-brand" : "text-muted-foreground",
        )}
      >
        {goalDone ? (
          <CircleCheckIcon className="size-4" aria-hidden />
        ) : (
          <TargetIcon className="size-4" aria-hidden />
        )}
        {goalDone ? learnPage.week.goalDone : learnPage.week.goal}
      </p>
    </section>
  )
}

function ProgressCard() {
  const { learned, next } = useCourse()
  const { done, total } = learnSummary(learned)
  return (
    <section aria-labelledby="progress-title" className={cardClass}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="progress-title" className="text-sm font-semibold">
          {learnPage.progress.title}
        </h2>
        <p className="text-sm font-semibold tabular-nums">
          {done}
          <span className="font-normal text-muted-foreground">/{total}</span>
        </p>
      </div>
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
      <dl className="mt-3 space-y-1.5 text-[13px]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ClockIcon className="size-3.5" aria-hidden />
          <dt className="sr-only">Time</dt>
          <dd>{learnPage.progress.left(minutesLeft(learned))}</dd>
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

/** The badges, earned in color with a little pop, the rest waiting in grey. */
function AchievementsCard() {
  const { badges } = useCourse()
  const earned = badges.filter((b) => b.done).length
  return (
    <section aria-labelledby="achievements-title" className={cardClass}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="achievements-title" className="text-sm font-semibold">
          {learnPage.achievements.title}
        </h2>
        <p className="text-xs font-medium text-muted-foreground tabular-nums">
          {learnPage.achievements.count(earned, achievements.length)}
        </p>
      </div>
      <ul className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4">
        {badges.map(({ id, label, description, icon: Icon, tone, done }) => (
          <li
            key={`${id}-${done}`}
            title={description}
            className="flex flex-col items-center text-center"
          >
            <span
              aria-hidden
              className={cn(
                "grid size-12 place-items-center rounded-2xl",
                done
                  ? cn(solidTile[tone], "animate-pop")
                  : "bg-secondary text-muted-foreground/50",
              )}
            >
              <Icon className="size-5" />
            </span>
            <span
              className={cn(
                "mt-2 text-[11px] leading-tight font-medium",
                !done && "text-muted-foreground",
              )}
            >
              {label}
            </span>
            <span className="sr-only">
              {done
                ? learnPage.achievements.earned
                : learnPage.achievements.locked}
              : {description}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** What each lesson lets Rocca take on: the rewards are real. */
function RewardsCard() {
  const { learned, ruleState } = useCourse()
  const statusOf = (concept: Concept) => {
    if (concept.id === LESSON_ID) {
      if (ruleState === "locked")
        return { open: false, text: learnPage.rewards.locked(concept.label) }
      return { open: true, text: learnPage.rewards[ruleState] }
    }
    return learned.includes(concept.id)
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
 * path (Duolingo-style), with a level, a streak and badges. Each stop says
 * which holding it comes from; tap it for the lesson, where it comes from
 * and what it unlocks. Only Concentration plays; the rest show the
 * coming-soon notice. The game is about learning, never trading.
 */
export function LearnPage() {
  return (
    <>
      <CourseHero />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        <div className="mx-auto w-full max-w-2xl py-2">
          <CoursePath />
        </div>
        <aside className="space-y-4">
          <StreakCard />
          <AchievementsCard />
          <ProgressCard />
          <RewardsCard />
        </aside>
      </div>
    </>
  )
}
