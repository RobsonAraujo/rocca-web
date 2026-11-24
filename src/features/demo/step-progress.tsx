"use client"

import { CheckIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { demoSteps } from "./constants"
import { flow } from "./content"

/** Where you are in the demo: four steps, labels from tablets up. */
export function StepProgress({ className }: { className?: string }) {
  const pathname = usePathname()
  const current = demoSteps.findIndex((step) => step.path === pathname)
  return (
    <ol aria-label={flow.progress} className={cn("items-center", className)}>
      {demoSteps.map((step, index) => {
        const done = index < current
        const active = index === current
        return (
          <li
            key={step.path}
            aria-current={active ? "step" : undefined}
            className="flex items-center"
          >
            {index > 0 && (
              <span
                aria-hidden
                className={cn(
                  "mx-2 h-px w-5 lg:w-8",
                  done || active ? "bg-brand/40" : "bg-border",
                )}
              />
            )}
            <span className="flex items-center gap-2 text-xs font-medium">
              <span
                aria-hidden
                className={cn(
                  "grid size-5 place-items-center rounded-full text-[11px] tabular-nums",
                  done && "bg-brand text-brand-foreground",
                  active && "bg-foreground text-background",
                  !done &&
                    !active &&
                    "border border-border text-muted-foreground",
                )}
              >
                {done ? <CheckIcon className="size-3" /> : index + 1}
              </span>
              <span
                className={cn(
                  "max-md:sr-only",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
