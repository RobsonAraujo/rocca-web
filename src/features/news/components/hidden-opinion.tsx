"use client"

import { FilterIcon } from "lucide-react"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"

import { newsCopy } from "../content"
import type { RankedNewsItem } from "../relevance"
import { NewsList } from "./news-list"

/**
 * "Rocca hid 3 opinion pieces", with a toggle to see them. `count` can be
 * larger than `items` when only the newest few are sent to the client.
 */
export function HiddenOpinion({
  items,
  count,
}: {
  items: RankedNewsItem[]
  count: number
}) {
  const [open, setOpen] = useState(false)
  const listId = useId()
  if (count === 0) return null

  const { hidden } = newsCopy
  return (
    <div className="mt-4 border-t border-border pt-3">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FilterIcon className="size-3.5 shrink-0" aria-hidden />
          {hidden.prefix} {count} {count === 1 ? hidden.one : hidden.many}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
          className="rounded-full"
        >
          {open ? hidden.hide : hidden.show}
        </Button>
      </div>
      <div id={listId} hidden={!open} className="mt-3 space-y-3">
        {open && (
          <>
            <p className="text-xs text-muted-foreground">{hidden.why}</p>
            <NewsList items={items} muted />
          </>
        )}
      </div>
    </div>
  )
}
