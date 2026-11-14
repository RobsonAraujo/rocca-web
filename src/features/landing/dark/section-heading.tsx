import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  id?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto max-w-2xl space-y-3 text-center", className)}>
      <p className="text-sm font-medium text-brand">{eyebrow}</p>
      <h2
        id={id}
        className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
      >
        {title}
      </h2>
      {description && (
        <p className="text-pretty text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
