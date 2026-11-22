"use client"

import { useSearchParams } from "next/navigation"
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { tour } from "../data"
import { parseWelcome } from "./welcome-banner"

export const TOUR_STORAGE_KEY = "rocca-tour-done"
/** Lets the welcome banner land before the tour starts. */
export const TOUR_DELAY_MS = 1500

/** Gap between the target and the popover, and from the viewport edges. */
const GAP = 12
const EDGE = 16
/** Phones keep a bottom tab bar; the popover never sits under it. */
const TAB_BAR = 96

function readDone() {
  try {
    return window.localStorage.getItem(TOUR_STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

function saveDone() {
  try {
    window.localStorage.setItem(TOUR_STORAGE_KEY, "1")
  } catch {
    // Private mode or blocked storage: the tour may show again. That's fine.
  }
}

/**
 * Both layouts are rendered and CSS hides one, so each step lists a
 * desktop and a phone id: pick the visible one. Without layout (jsdom has
 * no boxes at all), fall back to the first that exists.
 */
function findTarget(ids: readonly string[]) {
  const elements = ids
    .map((id) => document.getElementById(id))
    .filter((element): element is HTMLElement => element !== null)
  const visible = elements.find((element) => element.getClientRects().length)
  if (visible) return visible
  const hasLayout = document.documentElement.getClientRects().length > 0
  return hasLayout ? null : (elements[0] ?? null)
}

type Box = { top: number; left: number; width: number; height: number }

/** Below the target if it fits, else above, else pinned to the bottom. */
function placePopover(
  target: DOMRect,
  popover: { width: number; height: number },
) {
  const width = Math.min(popover.width, window.innerWidth - EDGE * 2)
  const bottomLimit =
    window.innerHeight - (window.innerWidth < 768 ? TAB_BAR : EDGE)
  const left = Math.min(
    Math.max(target.left, EDGE),
    window.innerWidth - width - EDGE,
  )
  const below = target.bottom + GAP
  if (below + popover.height <= bottomLimit) return { top: below, left }
  const above = target.top - GAP - popover.height
  if (above >= EDGE) return { top: above, left }
  return { top: bottomLimit - popover.height, left }
}

/**
 * Three-step tour on the first visit after signing up (`?welcome=new`) or
 * from a "Try the demo" link (`?welcome=demo`):
 * the decision, the autonomy controls and the chat. A spotlight ring marks
 * each target without blocking it, so people can try Approve mid-tour.
 * Skipping or finishing is remembered in localStorage.
 */
export function GuidedTour() {
  const welcome = parseWelcome(useSearchParams().get("welcome"))
  const [step, setStep] = useState<number | null>(null)
  const [spot, setSpot] = useState<Box | null>(null)
  const [position, setPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const primaryRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const bodyId = useId()

  useEffect(() => {
    // First visits only: a fresh signup or someone trying the demo.
    if ((welcome !== "new" && welcome !== "demo") || readDone()) return
    const timer = setTimeout(() => {
      // Only on a page that has every target (the overview).
      if (tour.steps.every((item) => findTarget(item.targets))) setStep(0)
    }, TOUR_DELAY_MS)
    return () => clearTimeout(timer)
  }, [welcome])

  const finish = useCallback(() => {
    saveDone()
    setStep(null)
  }, [])

  const current = step === null ? null : tour.steps[step]

  // Bring the target into view when the step changes.
  useEffect(() => {
    if (!current) return
    findTarget(current.targets)?.scrollIntoView?.({
      behavior: "smooth",
      block: "center",
    })
    primaryRef.current?.focus({ preventScroll: true })
  }, [current])

  // Follow the target every frame: scrolling and resizing move it, and so
  // do layout changes no event reports (the sidebar collapsing). Only real
  // changes reach state, so a still page doesn't re-render.
  useLayoutEffect(() => {
    if (!current) return
    let frame = 0
    let last = ""
    const update = () => {
      frame = requestAnimationFrame(update)
      const target = findTarget(current.targets)
      const popover = popoverRef.current
      if (!target || !popover) return
      const rect = target.getBoundingClientRect()
      const size = { width: popover.offsetWidth, height: popover.offsetHeight }
      const key = [
        rect.top,
        rect.left,
        rect.width,
        rect.height,
        size.width,
        size.height,
        window.innerWidth,
        window.innerHeight,
      ].join()
      if (key === last) return
      last = key
      setSpot({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
      setPosition(placePopover(rect, size))
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [current])

  useEffect(() => {
    if (!current) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [current, finish])

  if (step === null || !current) return null
  const last = step === tour.steps.length - 1

  return (
    <>
      {spot && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-40 rounded-3xl shadow-[0_0_0_9999px_rgb(0_0_0/0.18)] ring-4 ring-brand/60"
          style={{
            top: spot.top - 6,
            left: spot.left - 6,
            width: spot.width + 12,
            height: spot.height + 12,
          }}
        />
      )}
      <div
        key={step}
        ref={popoverRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className={cn(
          "fixed z-50 w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl bg-card p-4 text-foreground shadow-float ring-1 ring-foreground/10",
          // Follows scrolling every frame, so no position transition; just a fade per step.
          position ? "animate-in duration-200 fade-in" : "invisible",
        )}
        style={position ?? { top: 0, left: 0 }}
      >
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {tour.label} · {step + 1}/{tour.steps.length}
        </p>
        <h2 id={titleId} className="mt-1 font-semibold tracking-tight">
          {current.title}
        </h2>
        <p
          id={bodyId}
          className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground"
        >
          {current.body}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={finish}
            className="rounded-full px-2 text-muted-foreground"
          >
            {tour.skip}
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                className="rounded-full px-3"
              >
                {tour.back}
              </Button>
            )}
            <Button
              ref={primaryRef}
              type="button"
              size="sm"
              onClick={() => (last ? finish() : setStep(step + 1))}
              className="rounded-full px-3"
            >
              {last ? tour.done : tour.next}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
