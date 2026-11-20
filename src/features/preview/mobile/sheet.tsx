"use client"

import { Drawer } from "@base-ui/react/drawer"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { mobile } from "../data"

/*
 * iOS-style bottom sheets built on Base UI's Drawer: swipe down to dismiss,
 * backdrop fades with the swipe, safe-area aware. Styling follows the Base
 * UI bottom-drawer recipe (the 3rem "bleed" hides the gap under the sheet
 * while it springs).
 */

/** Shared handles: one sheet, several triggers (Drawer detached triggers). */
export const askSheet = Drawer.createHandle()
export const controlsSheet = Drawer.createHandle()
export const menuSheet = Drawer.createHandle()
export const connectSheet = Drawer.createHandle()

const backdropClass =
  "fixed inset-0 z-50 min-h-dvh bg-black [--backdrop-opacity:0.35] opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] supports-[-webkit-touch-callout:none]:absolute"

const popupClass =
  "-mb-[3rem] max-h-[calc(90dvh+3rem)] w-full overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-card px-5 pt-2.5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+3rem)] text-foreground shadow-float outline-none touch-auto [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:select-none data-starting-style:[transform:translateY(calc(100%-3rem+2px))] data-ending-style:[transform:translateY(calc(100%-3rem+2px))] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] motion-reduce:transition-none"

type SheetFrameProps = {
  title: string
  description?: string
  children: React.ReactNode
}

/** Portal, backdrop and popup chrome shared by every sheet. */
export function SheetFrame({ title, description, children }: SheetFrameProps) {
  return (
    <Drawer.Portal>
      <Drawer.Backdrop className={backdropClass} />
      <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
        <Drawer.Popup className={popupClass}>
          <div
            aria-hidden
            className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border"
          />
          <Drawer.Content className="mx-auto w-full max-w-lg">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Drawer.Title className="text-lg font-semibold tracking-tight">
                  {title}
                </Drawer.Title>
                {description && (
                  <Drawer.Description className="mt-0.5 text-sm text-muted-foreground">
                    {description}
                  </Drawer.Description>
                )}
              </div>
              <Drawer.Close
                aria-label={mobile.close}
                className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95"
              >
                <XIcon className="size-4" aria-hidden />
              </Drawer.Close>
            </div>
            {children}
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  )
}

type SheetProps = SheetFrameProps & {
  /** The element that opens the sheet (rendered as the Drawer trigger). */
  trigger: React.ReactElement
}

/** A sheet with its own trigger, for one-off details ("Why?"). */
export function Sheet({ trigger, ...frame }: SheetProps) {
  return (
    <Drawer.Root>
      <Drawer.Trigger render={trigger} />
      <SheetFrame {...frame} />
    </Drawer.Root>
  )
}

type HandleTriggerProps = Omit<React.ComponentProps<"button">, "type"> & {
  handle: typeof askSheet
}

/**
 * Opens a sheet mounted elsewhere (via its handle). Server components can't
 * reach into Drawer.Trigger directly, so they use this.
 */
export function SheetTrigger({
  handle,
  className,
  ...props
}: HandleTriggerProps) {
  return (
    <Drawer.Trigger
      handle={handle}
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

type HandleSheetProps = SheetFrameProps & {
  handle: typeof askSheet
  /** Sheets with text fields keep the focused field above the keyboard. */
  keyboardAware?: boolean
}

/** A sheet opened by detached triggers (tab bar, home rows). */
export function HandleSheet({
  handle,
  keyboardAware = false,
  ...frame
}: HandleSheetProps) {
  const content = <SheetFrame {...frame} />
  return (
    <Drawer.Root handle={handle}>
      {keyboardAware ? (
        <Drawer.VirtualKeyboardProvider>
          {content}
        </Drawer.VirtualKeyboardProvider>
      ) : (
        content
      )}
    </Drawer.Root>
  )
}
