"use client"

import { CircleCheckIcon, Loader2Icon } from "lucide-react"
import { useActionState, useEffect, useId, useRef } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { joinWaitlist } from "../actions"
import { WAITLIST_FIELDS } from "../constants"
import { EMAIL_MAX_LENGTH } from "../schema"
import { initialWaitlistState } from "../types"

/**
 * Visual variants only; behavior is identical.
 * - `split`: input and button side by side (stacked on mobile).
 * - `pill`: input and button inside one rounded capsule.
 */
export type WaitlistFormVariant = "split" | "pill"

type WaitlistFormProps = {
  className?: string
  submitLabel?: string
  variant?: WaitlistFormVariant
}

const styles = {
  split: {
    success: "rounded-xl",
    group: "flex flex-col gap-2 sm:flex-row",
    input: "h-11 bg-background/60 px-3.5 text-base md:text-base",
    button: "h-11 px-5",
    error: "",
    placeholder: "you@example.com",
  },
  pill: {
    success: "rounded-2xl",
    group:
      "flex items-center gap-1 rounded-full border border-input bg-card p-1 shadow-sm transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-destructive/20",
    input:
      "h-10 min-w-0 flex-1 rounded-full border-0 bg-transparent px-3.5 text-base shadow-none focus-visible:ring-0 aria-invalid:ring-0 sm:px-4 md:text-base dark:bg-transparent",
    button: "h-10 shrink-0 rounded-full px-4 sm:px-5",
    error: "px-4",
    // Shorter: the capsule leaves less room for the input on small screens.
    placeholder: "Your email",
  },
} satisfies Record<WaitlistFormVariant, Record<string, string>>

export function WaitlistForm({
  className,
  submitLabel = "Join the waitlist",
  variant = "split",
}: WaitlistFormProps) {
  const style = styles[variant]
  const [state, formAction, pending] = useActionState(
    joinWaitlist,
    initialWaitlistState,
  )
  const id = useId()
  const emailId = `${id}-email`
  const errorId = `${id}-error`
  const sourceRef = useRef<HTMLInputElement>(null)

  // Attribution: copy ?utm_source= into the hidden field. Reading it on the
  // client keeps the page fully static (no searchParams on the server).
  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get("utm_source")
    if (source && sourceRef.current) sourceRef.current.value = source
  }, [])

  useEffect(() => {
    if (state.status === "success" && !state.alreadyJoined) {
      toast.success("You're on the list.")
    }
  }, [state])

  if (state.status === "success") {
    return (
      <div
        role="status"
        className={cn(
          "flex w-full max-w-md items-start gap-3 border border-brand/30 bg-brand/10 p-4 text-left",
          style.success,
          className,
        )}
      >
        <CircleCheckIcon
          className="mt-0.5 size-5 shrink-0 text-brand"
          aria-hidden
        />
        <div className="space-y-1">
          <p className="font-medium">
            {state.alreadyJoined
              ? "You're already on the list."
              : "You're on the list."}
          </p>
          <p className="text-sm text-muted-foreground">
            We&apos;ll email you as soon as your invite is ready.
          </p>
        </div>
      </div>
    )
  }

  const error = state.status === "error" ? state.message : undefined

  return (
    <form
      action={formAction}
      className={cn("relative w-full max-w-md", className)}
    >
      <Field data-invalid={error ? true : undefined}>
        <FieldLabel htmlFor={emailId} className="sr-only">
          Email address
        </FieldLabel>
        <div className={style.group}>
          <Input
            id={emailId}
            name={WAITLIST_FIELDS.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={style.placeholder}
            required
            maxLength={EMAIL_MAX_LENGTH}
            defaultValue={
              state.status === "error" ? state.values.email : undefined
            }
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={style.input}
          />
          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className={style.button}
          >
            {pending && <Loader2Icon className="animate-spin" aria-hidden />}
            {pending ? "Joining…" : submitLabel}
          </Button>
        </div>
        <FieldError id={errorId} className={style.error}>
          {error}
        </FieldError>
      </Field>

      <input ref={sourceRef} type="hidden" name={WAITLIST_FIELDS.source} />

      {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          Company
          <input
            type="text"
            name={WAITLIST_FIELDS.honeypot}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
    </form>
  )
}
