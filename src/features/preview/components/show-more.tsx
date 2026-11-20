"use client"

import { ChevronDownIcon } from "lucide-react"
import { Children, useId, useState } from "react"

import { cn } from "@/lib/utils"

import { panelLinkClass } from "./panel"

/**
 * A list that shows its first `initial` items and a "Show all (n)" toggle
 * for the rest, so long panels stay scannable. Children are the <li>s;
 * they can be server-rendered.
 */
export function ShowMoreList({
  initial,
  showAll,
  showLess,
  className,
  children,
}: {
  initial: number
  showAll: string
  showLess: string
  className?: string
  children: React.ReactNode
}) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const items = Children.toArray(children)
  const hidden = items.length - initial
  return (
    <>
      <ul id={listId} className={className}>
        {open ? items : items.slice(0, initial)}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            panelLinkClass,
            "mt-1 w-full border-t border-border pt-3 text-muted-foreground hover:text-foreground hover:no-underline",
          )}
        >
          {open ? showLess : `${showAll} (${hidden})`}
          <ChevronDownIcon
            className={cn(
              "size-3.5 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      )}
    </>
  )
}
