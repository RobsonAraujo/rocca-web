import { cn } from "@/lib/utils"

/**
 * Layout primitives for the light layout. Every block goes through the same
 * container and section rhythm, so all content shares one left edge and one
 * vertical cadence.
 */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  )
}

type SectionProps = React.ComponentProps<"section"> & {
  /** `muted` sets the section on a soft band to separate it from neighbors. */
  tone?: "default" | "muted"
}

export function Section({
  tone = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        // scroll-mt matches the sticky header height (h-16).
        "scroll-mt-16 py-20 sm:py-24 lg:py-28",
        tone === "muted" && "bg-secondary/60",
        className,
      )}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  )
}

/** Visible keyboard focus for plain links (header, footer, logo). */
export const focusRing =
  "rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

/** Quiet navigation link used in the header and footer. */
export const navLinkClass = cn(
  "text-muted-foreground transition-colors hover:text-foreground",
  focusRing,
)
