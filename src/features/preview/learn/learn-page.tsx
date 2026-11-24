"use client"

import {
  CheckIcon,
  GraduationCapIcon,
  LockOpenIcon,
  PlayIcon,
  SparklesIcon,
} from "lucide-react"

import { toneClasses } from "@/components/product/tone"
import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { PageHeader } from "../components/page-header"
import { panelClass } from "../components/panel"
import { useDemo } from "../demo-state"
import type { Concept } from "./data"
import { concepts, learnPage } from "./data"
import { LearnRing } from "./learn-progress"
import { LessonButton } from "./open-lesson"
import { nextConcept } from "./progress"

type Status = keyof typeof learnPage.status

function StatusChip({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        status === "learned" && toneClasses.learn.tile,
        status === "next" && toneClasses.attention.tile,
        status === "notStarted" && "bg-secondary text-muted-foreground",
      )}
    >
      {status === "learned" && <CheckIcon className="size-3" aria-hidden />}
      {learnPage.status[status]}
    </span>
  )
}

function ConceptCard({
  concept,
  status,
}: {
  concept: Concept
  status: Status
}) {
  const learned = status === "learned"
  const buttonProps = {
    variant: learned ? "outline" : "default",
    size: "sm",
    className: cn(
      "mt-auto self-start rounded-lg px-3",
      !learned && toneClasses.learn.solid,
    ),
    children: (
      <>
        <PlayIcon aria-hidden />
        {learned ? learnPage.review : learnPage.start}
      </>
    ),
  } as const
  return (
    <article
      id={concept.id}
      aria-labelledby={`${concept.id}-title`}
      className={cn(panelClass, "flex scroll-mt-24 flex-col gap-3 p-5")}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">
          {concept.label}
        </p>
        <StatusChip status={status} />
      </div>
      <h2
        id={`${concept.id}-title`}
        className="text-base leading-snug font-semibold tracking-tight text-balance"
      >
        {concept.title}
      </h2>
      <dl className="space-y-2 text-[13px]">
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
        <LessonButton {...buttonProps} />
      ) : (
        <ComingSoonButton {...buttonProps} />
      )}
    </article>
  )
}

/**
 * /preview/learn: the course Rocca builds from what you own. Each concept
 * says which holding it comes from and what learning it lets Rocca handle.
 * Only Concentration plays; the rest show the coming-soon notice.
 */
export function LearnPage() {
  const { learned } = useDemo()
  const next = nextConcept(learned)
  const statusOf = (concept: Concept): Status =>
    learned.includes(concept.id)
      ? "learned"
      : concept.id === next?.id
        ? "next"
        : "notStarted"

  return (
    <>
      <PageHeader title={learnPage.title} subtitle={learnPage.subtitle} />

      <section
        aria-label={learnPage.upNext}
        className={cn(
          panelClass,
          "grid gap-5 p-5 sm:grid-cols-[auto_1fr] sm:items-center lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8",
        )}
      >
        <LearnRing className="size-14" withLabel />
        <div>
          {next ? (
            <>
              <p className="text-xs text-muted-foreground">
                {learnPage.upNext} · {next.label}
              </p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-balance">
                {next.title}
              </p>
              <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
                <SparklesIcon
                  className="mt-px size-3.5 shrink-0 text-learn"
                  aria-hidden
                />
                {learnPage.why}: {next.tie}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{learnPage.allDone}</p>
          )}
        </div>
        <div className="flex items-start gap-3 rounded-lg bg-control/[0.06] p-4 sm:col-span-2 lg:col-span-1">
          <GraduationCapIcon
            className="mt-0.5 size-4 shrink-0 text-control"
            aria-hidden
          />
          <div>
            <p className="text-sm font-semibold">{learnPage.how.title}</p>
            <p className="mt-0.5 text-[13px] text-pretty text-muted-foreground">
              {learnPage.how.body}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {concepts.map((concept) => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            status={statusOf(concept)}
          />
        ))}
      </div>
    </>
  )
}
