import { cn } from "@/lib/utils"

type SectionIntroProps = {
  eyebrow: string
  title: string
  id?: string
  className?: string
}

/** Left-aligned eyebrow + title used by the light layout sections. */
export function SectionIntro({
  eyebrow,
  title,
  id,
  className,
}: SectionIntroProps) {
  return (
    <div className={cn("max-w-xl space-y-4", className)}>
      <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <span className="h-px w-6 bg-brand" aria-hidden />
        {eyebrow}
      </p>
      <h2
        id={id}
        className="text-4xl leading-[1.08] font-medium tracking-[-0.035em] text-balance sm:text-5xl"
      >
        {title}
      </h2>
    </div>
  )
}
