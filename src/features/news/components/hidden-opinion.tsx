"use client"

import { useId, useState } from "react"

import type { NewsAudience } from "../content"
import { newsCopy } from "../content"
import type { RankedNewsItem } from "../relevance"
import { NewsList } from "./news-list"

/**
 * The card's footer: "Rocca hid 3 opinion pieces. Show" on the left,
 * `trailing` (the attribution) on the right, and the hidden pieces below
 * once shown. `count` can exceed `items` when only the newest few are sent.
 */
export function HiddenOpinion({
  items,
  count,
  audience = "portfolio",
  trailing,
}: {
  items: RankedNewsItem[]
  count: number
  audience?: NewsAudience
  trailing?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const listId = useId()
  const { hidden } = newsCopy
  const { why } = newsCopy.byAudience[audience]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs text-muted-foreground">
        {count > 0 ? (
          <p>
            {hidden.prefix} {count} {count === 1 ? hidden.one : hidden.many}.{" "}
            <button
              type="button"
              aria-expanded={open}
              aria-controls={listId}
              onClick={() => setOpen((value) => !value)}
              className="rounded-sm font-medium text-foreground underline decoration-border underline-offset-[3px] outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {open ? hidden.hide : hidden.show}
            </button>
          </p>
        ) : (
          <span />
        )}
        {trailing}
      </div>
      {count > 0 && (
        <div id={listId} hidden={!open} className="mt-5 space-y-4">
          {open && (
            <>
              <p className="text-xs text-muted-foreground">{why}</p>
              <NewsList items={items} muted audience={audience} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
