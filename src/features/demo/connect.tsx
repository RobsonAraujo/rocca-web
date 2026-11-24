"use client"

import {
  ArrowRightIcon,
  CheckIcon,
  ChevronRightIcon,
  Loader2Icon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useLayoutEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { toneClasses } from "@/components/product/tone"
import { illustrations } from "@/features/landing/content"
import { accountAccess } from "@/features/preview/data"
import { formatUsd } from "@/features/preview/format"
import type { AccountName } from "@/features/preview/portfolio/data"
import { accountTotal, connectCopy } from "@/features/preview/portfolio/data"
import { cn } from "@/lib/utils"

import {
  BROKER_MS,
  QUICK_CONNECT_MS,
  READ_STEP_MS,
  demoRoutes,
} from "./constants"
import { connect as copy } from "./content"
import { useDemoSession } from "./session"
import { prefersReducedMotion } from "./timing"

type Account = (typeof illustrations.accounts)[number]

/** The persona's accounts, by broker name (Fidelity → her Brokerage). */
const accountAt = (institution: string) =>
  illustrations.accounts.find((a) => a.institution === institution)

type Phase =
  | { kind: "pick" }
  | { kind: "secure"; account: Account; stage: "intro" | "opening" | "choose" }
  | { kind: "reading"; done: number }

/** Gap between the staggered quick connects of "Connect the other 3". */
const STAGGER_MS = 250

function AccessBadge({ access }: { access: Account["access"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        access === "trade"
          ? toneClasses.brand.tile
          : "bg-secondary text-muted-foreground",
      )}
    >
      {accountAccess[access]}
    </span>
  )
}

/** The connected accounts, as they come in, with the running total. */
function YourAccounts({ connected }: { connected: readonly AccountName[] }) {
  const accounts = connected.map((name) =>
    illustrations.accounts.find((a) => a.name === name)!,
  )
  const total = connected.reduce((sum, name) => sum + accountTotal(name), 0)
  return (
    <section
      aria-labelledby="your-accounts"
      className="rounded-2xl bg-card p-5 ring-1 ring-border"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="your-accounts" className="text-sm font-semibold">
          {copy.yours}
        </h2>
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {copy.summary(accounts.length, formatUsd(total))}
        </p>
      </div>
      {accounts.length > 0 ? (
        <ul className="mt-3 divide-y divide-border">
          {accounts.map((account) => (
            <li
              key={account.name}
              className="flex animate-in items-center gap-3 py-2.5 duration-300 fade-in slide-in-from-bottom-1 last:pb-0"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                <CheckIcon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {account.institution} · {account.name}
                </span>
                <span className="block text-xs text-muted-foreground tabular-nums">
                  {account.value}
                </span>
              </span>
              <AccessBadge access={account.access} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{copy.needAll}</p>
      )}
    </section>
  )
}

/**
 * The secure-connection step for the first broker: what Rocca can and
 * can't do there, a simulated hop to the broker's own page, then picking
 * the account to share. There is never a password field: you'd sign in on
 * the broker's site, and Rocca never sees it.
 */
function SecureConnect({
  phase,
  onOpen,
  onShare,
  onCancel,
}: {
  phase: Extract<Phase, { kind: "secure" }>
  onOpen: () => void
  onShare: () => void
  onCancel: () => void
}) {
  const { account, stage } = phase
  const broker = account.institution
  const { secure } = copy
  return (
    <section
      aria-labelledby="secure-title"
      className="animate-in rounded-2xl bg-card p-6 ring-1 ring-border duration-200 fade-in"
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-xl",
            toneClasses.brand.tile,
          )}
        >
          <ShieldCheckIcon className="size-5" aria-hidden />
        </span>
        <h2 id="secure-title" className="text-lg font-semibold tracking-tight">
          {secure.title(broker)}
        </h2>
      </div>

      {stage === "choose" ? (
        <div className="mt-5 animate-in duration-200 fade-in">
          <p className="text-sm font-medium">{secure.choose}</p>
          <label className="mt-3 flex items-center gap-3 rounded-xl p-3 ring-1 ring-border">
            <input
              type="checkbox"
              defaultChecked
              className="size-4 accent-brand"
            />
            <span className="flex-1 text-sm">
              {account.name}{" "}
              <span className="text-muted-foreground tabular-nums">
                · {account.value}
              </span>
            </span>
            <AccessBadge access={account.access} />
          </label>
          <Button
            type="button"
            onClick={onShare}
            className="mt-4 h-10 w-full rounded-xl text-sm"
          >
            {secure.share}
          </Button>
        </div>
      ) : (
        <>
          <ul className="mt-5 space-y-2.5 text-sm">
            {secure.points.map((point) => (
              <li key={point(broker)} className="flex items-start gap-2.5">
                <LockIcon
                  className="mt-0.5 size-4 shrink-0 text-brand"
                  aria-hidden
                />
                {point(broker)}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-secondary/60 px-3 py-2.5 text-[13px] text-pretty">
            {secure.access[account.access]}
          </p>
          <Button
            type="button"
            onClick={onOpen}
            disabled={stage === "opening"}
            className="mt-5 h-10 w-full rounded-xl text-sm"
          >
            {stage === "opening" ? (
              <>
                <Loader2Icon className="animate-spin" aria-hidden />
                {secure.opening(broker)}
              </>
            ) : (
              secure.open(broker)
            )}
          </Button>
        </>
      )}
      <button
        type="button"
        onClick={onCancel}
        className="mt-3 w-full rounded-lg py-1.5 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {secure.cancel}
      </button>
    </section>
  )
}

/** "Reading your accounts": a checklist that ticks itself, then moves on. */
function Reading({ done }: { done: number }) {
  return (
    <section
      aria-labelledby="reading-title"
      className="mx-auto max-w-md animate-in rounded-2xl bg-card p-6 ring-1 ring-border duration-200 fade-in"
    >
      <h2
        id="reading-title"
        className="flex items-center gap-2 text-lg font-semibold tracking-tight"
      >
        <Loader2Icon className="size-5 animate-spin text-brand" aria-hidden />
        {copy.reading.title}
      </h2>
      <ol aria-live="polite" className="mt-5 space-y-3 text-sm">
        {copy.reading.steps.map((step, index) => {
          const finished = index < done
          return (
            <li
              key={step}
              className={cn(
                "flex items-center gap-2.5 transition-colors",
                finished ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full",
                  finished
                    ? "bg-brand text-brand-foreground"
                    : "border border-border",
                )}
              >
                {finished && <CheckIcon className="size-3" />}
              </span>
              <span className="sr-only">{finished ? "Done: " : "To do: "}</span>
              {step}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/**
 * Step 3: connect the persona's four accounts. The first broker goes
 * through the secure-connection step; the rest connect in one click (or
 * all at once). Then Rocca "reads" them and moves on to the first look.
 *
 * Next keeps this page in an <Activity> when the demo moves on, so the
 * timers are cleared and the phase reset as it hides (useLayoutEffect
 * cleanup, as the Next docs show): Back lands on the connected list
 * instead of reading again.
 */
export function Connect() {
  const router = useRouter()
  const { connected, connect } = useDemoSession()
  const [phase, setPhase] = useState<Phase>({ kind: "pick" })
  const [pending, setPending] = useState<readonly AccountName[]>([])
  const [hint, setHint] = useState(false)
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())

  const later = useCallback((ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer)
      run()
    }, ms)
    timers.current.add(timer)
  }, [])

  useLayoutEffect(() => {
    const pendingTimers = timers.current
    return () => {
      for (const timer of pendingTimers) clearTimeout(timer)
      pendingTimers.clear()
      setPhase({ kind: "pick" })
      setPending([])
    }
  }, [])

  const all = illustrations.accounts.map((a) => a.name)
  const remaining = all.filter((name) => !connected.includes(name))
  const allConnected = remaining.length === 0

  const quickConnect = (name: AccountName, delay = 0) => {
    setPending((current) => [...current, name])
    later(delay + QUICK_CONNECT_MS, () => {
      connect(name)
      setPending((current) => current.filter((n) => n !== name))
    })
  }

  const pick = (institution: string) => {
    const account = accountAt(institution)
    if (!account) {
      setHint(true)
      return
    }
    setHint(false)
    if (connected.includes(account.name) || pending.includes(account.name)) {
      return
    }
    if (connected.length === 0) {
      setPhase({ kind: "secure", account, stage: "intro" })
    } else {
      quickConnect(account.name)
    }
  }

  const connectRest = () =>
    remaining
      .filter((name) => !pending.includes(name))
      .forEach((name, index) => quickConnect(name, index * STAGGER_MS))

  const read = () => {
    const steps = copy.reading.steps.length
    if (prefersReducedMotion()) {
      router.push(demoRoutes.firstLook)
      return
    }
    setPhase({ kind: "reading", done: 0 })
    for (let step = 1; step <= steps; step++) {
      later(step * READ_STEP_MS, () =>
        setPhase({ kind: "reading", done: step }),
      )
    }
    later((steps + 1) * READ_STEP_MS, () => router.push(demoRoutes.firstLook))
  }

  if (phase.kind === "reading") return <Reading done={phase.done} />

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {copy.title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
        {copy.description}
      </p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="lg:sticky lg:top-20 lg:order-2">
          <YourAccounts connected={connected} />
          {connected.length > 0 && (
            <div className="mt-4 space-y-2">
              {!allConnected && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={connectRest}
                  disabled={remaining.every((n) => pending.includes(n))}
                  className="h-10 w-full rounded-xl bg-card text-sm"
                >
                  {copy.connectRest(remaining.length)}
                </Button>
              )}
              <Button
                type="button"
                onClick={read}
                disabled={!allConnected}
                className="h-11 w-full rounded-xl text-sm"
              >
                {copy.continue}
                <ArrowRightIcon aria-hidden />
              </Button>
            </div>
          )}
        </div>

        <div className="lg:order-1">
          {phase.kind === "secure" ? (
            <SecureConnect
              phase={phase}
              onOpen={() => {
                setPhase({ ...phase, stage: "opening" })
                later(BROKER_MS, () => setPhase({ ...phase, stage: "choose" }))
              }}
              onShare={() => {
                connect(phase.account.name)
                setPhase({ kind: "pick" })
              }}
              onCancel={() => setPhase({ kind: "pick" })}
            />
          ) : (
            <div className="space-y-6">
              {connectCopy.groups.map((group) => {
                const headingId = `demo-connect-${group.access}`
                return (
                  <section key={group.access} aria-labelledby={headingId}>
                    <h2
                      id={headingId}
                      className="flex items-center gap-2 text-sm font-semibold"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "size-2 rounded-full",
                          group.access === "trade"
                            ? "bg-brand"
                            : "bg-muted-foreground/40",
                        )}
                      />
                      {group.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {group.description}
                    </p>
                    <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {group.institutions.map((name) => {
                        const account = accountAt(name)
                        const isConnected =
                          !!account && connected.includes(account.name)
                        const isPending =
                          !!account && pending.includes(account.name)
                        return (
                          <li key={name}>
                            <button
                              type="button"
                              onClick={() => pick(name)}
                              aria-label={
                                isConnected
                                  ? `${name}, ${copy.connected}`
                                  : isPending
                                    ? `${name}, ${copy.connecting}`
                                    : name
                              }
                              className={cn(
                                "flex h-12 w-full items-center justify-between gap-2 rounded-xl bg-card px-3 text-left text-sm font-medium ring-1 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                                isConnected
                                  ? "ring-brand/40"
                                  : "ring-border hover:bg-muted",
                              )}
                            >
                              <span className="truncate">{name}</span>
                              {isConnected ? (
                                <CheckIcon
                                  className="size-4 shrink-0 text-brand"
                                  aria-hidden
                                />
                              ) : isPending ? (
                                <Loader2Icon
                                  className="size-4 shrink-0 animate-spin text-muted-foreground"
                                  aria-hidden
                                />
                              ) : (
                                <ChevronRightIcon
                                  className="size-4 shrink-0 text-muted-foreground"
                                  aria-hidden
                                />
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                )
              })}
              <p aria-live="polite" className="text-xs text-muted-foreground">
                {hint ? copy.notHers : connectCopy.note}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
