import { SparklesIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { demo } from "../data"

/** The waitlist reminder that closes every simulation. */
export function WaitlistNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-1.5 text-xs text-pretty text-muted-foreground",
        className,
      )}
    >
      <SparklesIcon
        className="mt-px size-3.5 shrink-0 text-brand"
        aria-hidden
      />
      {demo.waitlistNote}
    </p>
  )
}
