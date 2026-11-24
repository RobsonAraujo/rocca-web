"use client"

import { CircleUserRoundIcon, Loader2Icon, MailIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useId, useState, useTransition } from "react"

import { LogoMark } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { SIGN_IN_MS, demoRoutes } from "./constants"
import { persona, signIn as copy } from "./content"
import { useDemoSession } from "./session"
import { wait } from "./timing"

type Method = "google" | "email"

/**
 * Step 1: a simulated sign-in for the fictional investor. Either button
 * "signs in" after a short pause and moves on to the onboarding question.
 * The pause runs inside a transition, so `isPending` drives the spinner and
 * nothing is left to reset if the visitor comes back to this page.
 */
export function SignIn() {
  const router = useRouter()
  const { signIn } = useDemoSession()
  const [isPending, startTransition] = useTransition()
  const [method, setMethod] = useState<Method | null>(null)
  const emailId = useId()

  const go = (next: Method) => {
    setMethod(next)
    startTransition(async () => {
      await wait(SIGN_IN_MS)
      signIn()
      router.push(demoRoutes.onboarding)
    })
  }

  const label = (which: Method, idle: string) =>
    isPending && method === which ? copy.pending : idle
  const spinner = (which: Method, icon: React.ReactNode) =>
    isPending && method === which ? (
      <Loader2Icon className="animate-spin" aria-hidden />
    ) : (
      icon
    )

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border sm:p-8">
        <LogoMark className="size-10" />
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          {copy.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{copy.description}</p>

        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => go("google")}
          className="mt-6 h-11 w-full rounded-xl bg-card text-sm"
        >
          {spinner("google", <CircleUserRoundIcon aria-hidden />)}
          {label("google", copy.google)}
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span aria-hidden className="h-px flex-1 bg-border" />
          {copy.or}
          <span aria-hidden className="h-px flex-1 bg-border" />
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            go("email")
          }}
        >
          <label htmlFor={emailId} className="text-sm font-medium">
            {copy.emailLabel}
          </label>
          <Input
            id={emailId}
            type="email"
            name="email"
            autoComplete="off"
            defaultValue={persona.email}
            className="mt-1.5 h-11 rounded-xl bg-card px-3"
          />
          <Button
            type="submit"
            disabled={isPending}
            className="mt-3 h-11 w-full rounded-xl text-sm"
          >
            {spinner("email", <MailIcon aria-hidden />)}
            {label("email", copy.email)}
          </Button>
        </form>
      </div>
      <p className="mt-4 text-center text-xs text-pretty text-muted-foreground">
        {copy.note}
      </p>
    </div>
  )
}
