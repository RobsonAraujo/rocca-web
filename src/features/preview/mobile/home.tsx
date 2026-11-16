import {
  GraduationCapIcon,
  HistoryIcon,
  MicIcon,
  PiggyBankIcon,
  PlayIcon,
  ReceiptIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react"

import { OrderLines } from "@/components/product/order-lines"
import { ProgressRing } from "@/components/product/progress-ring"
import type { Tone } from "@/components/product/tone"
import { toneClasses } from "@/components/product/tone"
import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import {
  autonomy,
  learn,
  mobile,
  moves,
  portfolio,
  savings,
  shell,
  suggestion,
  trackRecord,
} from "../data"
import { AutonomyDial, InThisMode, Rules } from "../widgets/autonomy"
import { HeroChart } from "../widgets/chart-ranges"
import { MobileDecision } from "../widgets/suggestion-actions"
import { ControlsGroup } from "./controls-group"
import { RevealOnHash } from "./reveal-on-hash"
import {
  HandleSheet,
  Sheet,
  SheetTrigger,
  askSheet,
  controlsSheet,
} from "./sheet"

/** Tappable surfaces get a small press feedback, like native buttons. */
const pressable = "transition-transform active:scale-[0.98]"

function SectionLabel({ tone, children }: { tone: Tone; children: string }) {
  return (
    <p className="flex items-center gap-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      <span
        aria-hidden
        className={cn("size-2 rounded-full", {
          "bg-attention": tone === "attention",
          "bg-control": tone === "control",
          "bg-learn": tone === "learn",
          "bg-brand": tone === "brand",
        })}
      />
      {children}
    </p>
  )
}

/** Big balance up top, the way investing apps open. */
function BalanceHero() {
  const { weekChange } = portfolio
  return (
    <section aria-labelledby="m-balance-label">
      <p id="m-balance-label" className="text-sm text-muted-foreground">
        {shell.greeting} · {mobile.hero.label}
      </p>
      <p className="mt-1 text-[2.5rem] leading-none font-semibold tracking-tight tabular-nums">
        {portfolio.value}
      </p>
      <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-sm font-medium text-brand">
        <TrendingUpIcon className="size-4" aria-hidden />
        {weekChange.amount} · {weekChange.label}
      </p>
      <HeroChart note={mobile.hero.simulated} />
    </section>
  )
}

/** Looks like a search field; opens the Ask sheet. */
function AskBar() {
  return (
    <SheetTrigger
      id="m-ask"
      handle={askSheet}
      className={cn(
        "flex h-12 w-full scroll-mt-20 items-center gap-3 rounded-2xl bg-card px-4 text-left text-muted-foreground shadow-soft ring-1 ring-foreground/10",
        pressable,
      )}
    >
      <SparklesIcon className="size-5 shrink-0 text-brand" aria-hidden />
      <span className="flex-1 truncate text-[15px]">{mobile.askBar}</span>
      <MicIcon className="size-5 shrink-0" aria-hidden />
    </SheetTrigger>
  )
}

/** Reasoning and next steps, shown in the "Why?" sheet. */
function WhyDetails() {
  return (
    <div className="space-y-6">
      <ol className="space-y-4">
        {suggestion.reasoning.map((step, index) => (
          <li key={step.source} className="flex gap-3">
            <span
              aria-hidden
              className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold tabular-nums"
            >
              {index + 1}
            </span>
            <div className="text-sm leading-relaxed">
              <p>{step.text}</p>
              <span className="mt-1.5 inline-flex rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                Source: {step.source}
              </span>
            </div>
          </li>
        ))}
      </ol>
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {suggestion.next.title}
        </p>
        <ol className="mt-3 space-y-3">
          {suggestion.next.steps.map((step, index) => (
            <li key={step} className="flex items-start gap-2.5 text-sm">
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center rounded-full border border-brand/40 text-xs font-semibold text-brand tabular-nums"
              >
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
      <ComingSoonButton
        variant="ghost"
        className={cn(
          "h-11 w-full justify-start rounded-xl px-3 text-sm font-medium",
          toneClasses.learn.soft,
          toneClasses.learn.text,
        )}
      >
        <GraduationCapIcon aria-hidden />
        {suggestion.lesson}
      </ComingSoonButton>
    </div>
  )
}

/** The decision, sized for thumbs: big Approve, details one tap away. */
function DecisionCard() {
  const { order, taxSmart } = suggestion
  return (
    <RevealOnHash hash="suggestion">
      <article
        id="m-suggestion"
        aria-labelledby="m-suggestion-title"
        className="rounded-3xl border-t-4 border-t-attention bg-card p-5 shadow-soft ring-1 ring-attention/30"
      >
        <p
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
            toneClasses.attention.tile,
          )}
        >
          <span aria-hidden className="size-1.5 rounded-full bg-attention" />
          {suggestion.eyebrow}
        </p>
        <h2
          id="m-suggestion-title"
          className="mt-3 text-xl leading-snug font-semibold tracking-tight text-balance"
        >
          {suggestion.title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted-foreground">
          {suggestion.summary}
        </p>

        <OrderLines lines={order.lines} className="mt-3" />
        <p className="mt-1 flex items-start gap-1.5 rounded-xl bg-brand/[0.08] px-3 py-2.5 text-xs">
          <ReceiptIcon
            className="mt-px size-3.5 shrink-0 text-brand"
            aria-hidden
          />
          <span className="shrink-0 font-semibold whitespace-nowrap text-brand">
            {taxSmart.estimate}
          </span>
          <span className="text-pretty text-muted-foreground">
            in your {taxSmart.account} {taxSmart.comparison}
          </span>
        </p>

        <MobileDecision
          why={
            <Sheet
              title={mobile.decision.whyTitle}
              description={suggestion.title}
              trigger={
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-border bg-card text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98]"
                >
                  {mobile.decision.why}
                </button>
              }
            >
              <WhyDetails />
            </Sheet>
          }
        />
      </article>
    </RevealOnHash>
  )
}

const cardClass = cn(
  "flex w-[82%] max-w-80 shrink-0 snap-start flex-col rounded-3xl p-4 ring-1",
  pressable,
)

function LearnCard() {
  return (
    <article
      className={cn(cardClass, toneClasses.learn.soft, toneClasses.learn.ring)}
    >
      <p
        className={cn(
          "flex items-center gap-1.5 text-xs font-semibold",
          toneClasses.learn.text,
        )}
      >
        <GraduationCapIcon className="size-4" aria-hidden />
        {learn.title}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <ProgressRing
          done={learn.progress.done}
          total={learn.progress.total}
          className="size-12"
        />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{learn.next.meta}</p>
          <h3 className="text-sm leading-snug font-semibold text-balance">
            {learn.next.title}
          </h3>
        </div>
      </div>
      <ComingSoonButton
        size="sm"
        className={cn(
          "mt-auto h-9 self-start rounded-full px-3.5",
          toneClasses.learn.solid,
        )}
      >
        <PlayIcon aria-hidden />
        {learn.next.cta}
      </ComingSoonButton>
    </article>
  )
}

function SavingsCard() {
  return (
    <article
      className={cn(cardClass, toneClasses.brand.soft, toneClasses.brand.ring)}
    >
      <p className="flex items-center gap-1.5 text-xs font-semibold text-brand">
        <PiggyBankIcon className="size-4" aria-hidden />
        {savings.title}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
        {savings.total}{" "}
        <span className="text-sm font-normal tracking-normal text-muted-foreground">
          {savings.per}
        </span>
      </p>
      <ul className="mt-2 mb-4 space-y-1 text-xs">
        {savings.items.map((item) => (
          <li key={item.label} className="flex justify-between gap-3">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-semibold text-brand tabular-nums">
              {item.amount}
            </span>
          </li>
        ))}
      </ul>
      <ComingSoonButton
        size="sm"
        variant="outline"
        className="mt-auto h-9 self-start rounded-full bg-card px-3.5"
      >
        {mobile.forYou.savingsCta}
      </ComingSoonButton>
    </article>
  )
}

function TrackCard() {
  const [suggestions, approved, impact] = trackRecord.stats
  return (
    <article className={cn(cardClass, "bg-card ring-foreground/10")}>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <HistoryIcon className="size-4" aria-hidden />
        {trackRecord.title}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-brand tabular-nums">
        {impact?.value}
      </p>
      <p className="text-xs text-muted-foreground">
        {mobile.forYou.trackSummary}
      </p>
      <p className="mt-2 mb-4 text-xs">
        {approved?.value} {mobile.forYou.approvedOf} {suggestions?.value} ·{" "}
        {trackRecord.misses.length} {mobile.forYou.misses}
      </p>
      <ComingSoonButton
        size="sm"
        variant="outline"
        className="mt-auto h-9 self-start rounded-full px-3.5"
      >
        {mobile.forYou.trackCta}
      </ComingSoonButton>
    </article>
  )
}

/** Swipeable cards; the next one peeks in so it's clear there's more. */
function ForYou() {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden">
      <LearnCard />
      <SavingsCard />
      <TrackCard />
    </div>
  )
}

function MovesList() {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-foreground/10">
      <ul className="space-y-3">
        {moves.items.map((move) => (
          <li
            key={move.symbol}
            className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 text-sm"
          >
            <span className="font-medium">{move.symbol}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <span
                className="block h-full rounded-full bg-brand"
                style={{ width: `${move.share}%` }}
              />
            </span>
            <span className="font-medium whitespace-nowrap tabular-nums">
              {move.amount}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-pretty text-muted-foreground">
        {moves.explanation}
      </p>
    </div>
  )
}

/**
 * Home screen for phones, in the shape of a native investing app: balance
 * first, then the one decision that needs you, your controls, cards for
 * you, and what moved. Details live in bottom sheets.
 */
export function MobileHome() {
  return (
    <>
      <BalanceHero />
      <AskBar />

      <section aria-label={mobile.sections.decision} className="space-y-3">
        <SectionLabel tone="attention">{mobile.sections.decision}</SectionLabel>
        <DecisionCard />
      </section>

      <section aria-label={mobile.sections.controls} className="space-y-3">
        <SectionLabel tone="control">{mobile.sections.controls}</SectionLabel>
        <div id="m-controls" className="scroll-mt-20">
          <ControlsGroup />
        </div>
        <HandleSheet
          handle={controlsSheet}
          title={autonomy.title}
          description={autonomy.description}
        >
          <div className="space-y-5">
            <AutonomyDial />
            <InThisMode />
            <Rules />
          </div>
        </HandleSheet>
      </section>

      <section aria-label={mobile.sections.forYou} className="space-y-3">
        <SectionLabel tone="learn">{mobile.sections.forYou}</SectionLabel>
        <ForYou />
      </section>

      <section aria-label={mobile.sections.moves} className="space-y-3">
        <SectionLabel tone="brand">{mobile.sections.moves}</SectionLabel>
        <MovesList />
      </section>
    </>
  )
}
