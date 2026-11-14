import { ArrowRightIcon, GraduationCapIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { Panel } from "../components/panel"
import type { InsightTone } from "./data"
import { insights, insightsCopy } from "./data"

/** Attention = amber (same as rules), opportunity = brand, good news = neutral. */
const toneStyle: Record<InsightTone, { chip: string; icon: string }> = {
  attention: { chip: "bg-amber-500/10 text-amber-700", icon: "text-amber-600" },
  opportunity: { chip: "bg-brand/10 text-brand", icon: "text-brand" },
  good: { chip: "bg-secondary text-foreground", icon: "text-brand" },
}

export function InsightsWidget({ className }: { className?: string }) {
  return (
    <Panel
      id="insights"
      title={insightsCopy.title}
      description={insightsCopy.description}
      icon={SparklesIcon}
      className={className}
    >
      <ul className="space-y-3">
        {insights.map(({ id, tone, tag, icon: Icon, title, body, action }) => (
          <li key={id} className="rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <Icon
                className={cn("mt-0.5 size-4 shrink-0", toneStyle[tone].icon)}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    "inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                    toneStyle[tone].chip,
                  )}
                >
                  {tag}
                </span>
                <h3 className="mt-1.5 text-sm font-semibold text-balance">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">
                  {body}
                </p>
                {"href" in action ? (
                  <Link
                    href={action.href}
                    className="mt-2.5 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-brand outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {action.label}
                    <ArrowRightIcon className="size-3.5" aria-hidden />
                  </Link>
                ) : (
                  <ComingSoonButton
                    variant="link"
                    className="mt-2 h-auto justify-start p-0 text-left text-sm font-medium whitespace-normal text-foreground"
                  >
                    <GraduationCapIcon className="text-brand" aria-hidden />
                    {action.lesson}
                  </ComingSoonButton>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
