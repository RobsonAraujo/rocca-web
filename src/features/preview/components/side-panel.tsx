"use client"

import { Drawer } from "@base-ui/react/drawer"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { shell } from "../data"

/*
 * Right-hand panel for tablets and desktop, on Base UI's Drawer (swipe right
 * to dismiss). Same handle pattern as the phone sheets: the panel is mounted
 * once and any number of detached triggers open it.
 */

export const askPanel = Drawer.createHandle()
export const reasoningPanel = Drawer.createHandle()

type PanelHandle = typeof askPanel

const backdropClass =
  "fixed inset-0 z-50 min-h-dvh bg-black [--backdrop-opacity:0.18] opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] motion-reduce:transition-none"

// The 3rem "bleed" past the right edge hides the gap while the panel springs
// (Base UI's side-drawer recipe).
const popupClass =
  "-mr-12 flex h-full w-[calc(26rem+3rem)] max-w-[calc(100vw-2rem+3rem)] flex-col border-l border-border bg-card pr-12 text-foreground shadow-float outline-none [transform:translateX(var(--drawer-swipe-movement-x))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:select-none data-starting-style:[transform:translateX(calc(100%-3rem+2px))] data-ending-style:[transform:translateX(calc(100%-3rem+2px))] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] motion-reduce:transition-none"

type SidePanelProps = {
  handle: PanelHandle
  title: string
  description?: string
  children: React.ReactNode
}

/** The panel itself: header with title and close, a scrolling body. */
export function SidePanel({
  handle,
  title,
  description,
  children,
}: SidePanelProps) {
  return (
    <Drawer.Root handle={handle} swipeDirection="right">
      <Drawer.Portal>
        <Drawer.Backdrop className={backdropClass} />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-stretch justify-end">
          <Drawer.Popup className={popupClass}>
            <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div className="min-w-0">
                <Drawer.Title className="text-base font-semibold tracking-tight">
                  {title}
                </Drawer.Title>
                {description && (
                  <Drawer.Description className="mt-0.5 text-[13px] text-muted-foreground">
                    {description}
                  </Drawer.Description>
                )}
              </div>
              <Drawer.Close
                aria-label={shell.close}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <XIcon className="size-4" aria-hidden />
              </Drawer.Close>
            </header>
            <Drawer.Content className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              {children}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

type SidePanelTriggerProps = Omit<React.ComponentProps<"button">, "type"> & {
  handle: PanelHandle
}

/** Opens a side panel mounted elsewhere; usable from server components. */
export function SidePanelTrigger({
  handle,
  className,
  ...props
}: SidePanelTriggerProps) {
  return (
    <Drawer.Trigger
      handle={handle}
      className={cn("outline-none", className)}
      {...props}
    />
  )
}
