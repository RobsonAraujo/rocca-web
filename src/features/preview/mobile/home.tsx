import {
  GraduationCapIcon,
  HistoryIcon,
  MicIcon,
  PiggyBankIcon,
  PlayIcon,
  ReceiptIcon,
  SparklesIcon,
} from "lucide-react"

import { OrderLines } from "@/components/product/order-lines"
import { toneClasses } from "@/components/product/tone"
import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { Delta } from "../components/delta"
import { Greeting } from "../components/greeting"
import { VariantSwitch } from "../components/variant"
import {
  autonomy,
  learn,
  mobile,
  moves,
  portfolio,
  savings,
  suggestion,
  trackRecord,
} from "../data"
import { LearnRing, StartLessonButton } from "../learn/learn-progress"
import { LessonPrompt } from "../learn/open-lesson"
import { ModeSwitch, InThisMode, Rules } from "../widgets/autonomy"
import { HeroChart } from "../widgets/chart-ranges"
import { MobileDecision } from "../widgets/suggestion-actions"
import { SuggestionDetails } from "../widgets/suggestion-details"
import { TrackCardStart } from "../widgets/track-record-start"
import { ControlsGroup } from "./controls-group"
import { RevealOnHash } from "./reveal-on-hash"
import {
  HandleSheet,
  SheetTrigger,
  askSheet,
  controlsSheet,
  whySheet,
} from "./sheet"

/** Tappable surfaces get a small press feedback, like native buttons. */
const pressable = "transition-transform active:scale-[0.98]"

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="px-1 text-[15px] font-semibold tracking-tight">{children}</p>
  )
}

/** Big balance up top, the way investing apps open. */
function BalanceHero() {
  const { weekChange } = portfolio
  return (
    <section aria-labelledby="m-balance-label">
      <p id="m-balance-label" className="text-sm text-muted-foreground">
        <Greeting /> · {mobile.hero.label}
      </p>
      <p className="mt-1 text-[2.5rem] leading-none font-semibold tracking-tight tabular-nums">
        {portfolio.value}
      </p>
      <p className="mt-3 flex items-center gap-1.5 text-sm">
        <Delta value={weekChange.amount} />
        <span className="text-muted-foreground">{weekChange.label}</span>
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
        "flex h-12 w-full scroll-mt-20 items-center gap-3 rounded-2xl bg-card px-4 text-left text-muted-foreground ring-1 ring-border",
        pressable,
      )}
    >
      <SparklesIcon className="size-5 shrink-0 text-brand" aria-hidden />
      <span className="flex-1 truncate text-[15px]">{mobile.askBar}</span>
      <MicIcon className="size-5 shrink-0" aria-hidden />
    </SheetTrigger>
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
        className="rounded-3xl bg-card p-5 ring-1 ring-border"
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

        <LessonPrompt className="mt-4" />
        <MobileDecision
          why={
            <SheetTrigger
              handle={whySheet}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-border bg-card text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98]"
            >
              {mobile.decision.why}
            </SheetTrigger>
          }
        />
        {/* On a handle, so the lesson can close it before it opens. */}
        <HandleSheet
          handle={whySheet}
          title={mobile.decision.whyTitle}
          description={suggestion.title}
        >
          <SuggestionDetails />
        </HandleSheet>
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
    <article className={cn(cardClass, "bg-card ring-border")}>
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
        <LearnRing className="size-12" />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{learn.next.meta}</p>
          <h3 className="text-sm leading-snug font-semibold text-balance">
            {learn.next.title}
          </h3>
        </div>
      </div>
      <StartLessonButton
        size="sm"
        className={cn(
          "mt-auto h-9 self-start rounded-full px-3.5",
          toneClasses.learn.solid,
        )}
        icon={<PlayIcon aria-hidden />}
      />
    </article>
  )
}

function SavingsCard() {
  return (
    <article className={cn(cardClass, "bg-card ring-border")}>
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
    <article className={cn(cardClass, "bg-card ring-border")}>
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
      <VariantSwitch
        fallback={<TrackCard />}
        firstRun={<TrackCardStart className={cardClass} />}
      />
    </div>
  )
}

function MovesList() {
  return (
    <div className="rounded-2xl bg-card p-4 ring-1 ring-border">
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
            <Delta value={move.amount} className="justify-self-end" />
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
 * first, then the one decision that needs you, the news about what you own,
 * your controls, cards for you and what moved. Details live in bottom sheets.
 */
export function MobileHome({ news }: { news?: React.ReactNode } = {}) {
  return (
    <>
      <BalanceHero />
      <AskBar />

      <section aria-label={mobile.sections.decision} className="space-y-3">
        <SectionLabel>{mobile.sections.decision}</SectionLabel>
        <DecisionCard />
      </section>

      {news && (
        <section aria-label={mobile.sections.news} className="space-y-3">
          <SectionLabel>{mobile.sections.news}</SectionLabel>
          {news}
        </section>
      )}

      <section aria-label={mobile.sections.controls} className="space-y-3">
        <SectionLabel>{mobile.sections.controls}</SectionLabel>
        <div id="m-controls" className="scroll-mt-20">
          <ControlsGroup />
        </div>
        <HandleSheet
          handle={controlsSheet}
          title={autonomy.title}
          description={autonomy.description}
        >
          <div className="space-y-5">
            <ModeSwitch />
            <InThisMode />
            <Rules />
          </div>
        </HandleSheet>
      </section>

      <section aria-label={mobile.sections.forYou} className="space-y-3">
        <SectionLabel>{mobile.sections.forYou}</SectionLabel>
        <ForYou />
      </section>

      <section aria-label={mobile.sections.moves} className="space-y-3">
        <SectionLabel>{mobile.sections.moves}</SectionLabel>
        <MovesList />
      </section>
    </>
  )
}
