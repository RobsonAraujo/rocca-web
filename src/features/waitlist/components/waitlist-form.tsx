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

type WaitlistFormProps = {
  className?: string
  submitLabel?: string
}

export function WaitlistForm({
  className,
  submitLabel = "Join the waitlist",
}: WaitlistFormProps) {
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
          "flex w-full max-w-md items-start gap-3 rounded-xl border border-brand/30 bg-brand/10 p-4 text-left",
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id={emailId}
            name={WAITLIST_FIELDS.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            maxLength={EMAIL_MAX_LENGTH}
            defaultValue={
              state.status === "error" ? state.values.email : undefined
            }
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="h-11 bg-background/60 px-3.5 text-base md:text-base"
          />
          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="h-11 px-5"
          >
            {pending && <Loader2Icon className="animate-spin" aria-hidden />}
            {pending ? "Joining…" : submitLabel}
          </Button>
        </div>
        <FieldError id={errorId}>{error}</FieldError>
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
