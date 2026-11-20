"use client"

import { SquarePenIcon } from "lucide-react"

import { LogoMark } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ComingSoonButton } from "../components/coming-soon"
import { ask } from "../data"
import { useChat } from "./chat-state"
import { ASK_INPUT_ID, ChatComposer, ComposerNote } from "./composer"
import { ChatThread, Starters } from "./thread"

/** Starts over, like ChatGPT's "New chat". */
export function NewChatButton({
  iconOnly = false,
  className,
}: {
  iconOnly?: boolean
  className?: string
}) {
  const { reset, exchanges } = useChat()
  return (
    <Button
      type="button"
      variant={iconOnly ? "ghost" : "outline"}
      size={iconOnly ? "icon" : "default"}
      onClick={reset}
      disabled={exchanges.length === 0}
      aria-label={iconOnly ? ask.newChat : undefined}
      className={cn(
        iconOnly
          ? "size-8 rounded-lg text-muted-foreground"
          : "h-9 w-full justify-start rounded-lg bg-card",
        className,
      )}
    >
      <SquarePenIcon aria-hidden />
      {!iconOnly && ask.newChat}
    </Button>
  )
}

/**
 * Past chats, ChatGPT-style: today's conversation (the one on screen),
 * then earlier ones, which need the real product (coming soon).
 */
function History({ className }: { className?: string }) {
  const { exchanges } = useChat()
  const current = exchanges[0]?.question
  const { history } = ask
  return (
    <nav aria-label={history.label} className={cn("space-y-5", className)}>
      <NewChatButton />
      {current && (
        <div>
          <p className="px-2 text-xs font-medium text-muted-foreground">
            {history.today}
          </p>
          <p
            aria-current="true"
            className="mt-1 truncate rounded-lg bg-secondary px-2 py-1.5 text-sm font-medium"
          >
            {current}
          </p>
        </div>
      )}
      <div>
        <p className="px-2 text-xs font-medium text-muted-foreground">
          {history.earlier}
        </p>
        <ul className="mt-1 space-y-0.5">
          {history.items.map((item) => (
            <li key={item}>
              <ComingSoonButton
                variant="ghost"
                className="h-auto w-full justify-start truncate rounded-lg px-2 py-1.5 text-sm font-normal text-muted-foreground"
              >
                {item}
              </ComingSoonButton>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

/**
 * The full Ask Rocca chat. Empty, it's the ChatGPT start screen: a
 * question, a big composer and starters. Once you ask, the conversation
 * fills the column and the composer docks at the bottom (above the phone
 * tab bar). Past chats sit on the left on large screens.
 */
export function AskPage() {
  const { exchanges } = useChat()
  const empty = exchanges.length === 0

  return (
    <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-8">
      <History className="sticky top-20 self-start max-lg:hidden" />

      <div className="mx-auto w-full max-w-3xl">
        {empty ? (
          <div className="flex min-h-[calc(100svh-15rem)] flex-col justify-center py-6">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand">
              <LogoMark className="size-7 text-brand-foreground" />
            </span>
            <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {ask.greeting}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {ask.greetingNote}
            </p>
            {/* No autofocus here: on phones it would pop the keyboard on arrival. */}
            <ChatComposer id={ASK_INPUT_ID} size="large" className="mt-8" />
            <Starters layout="cards" className="mt-4" />
            <ComposerNote className="mt-6" />
          </div>
        ) : (
          <>
            <h1 className="sr-only">{ask.label}</h1>
            <ChatThread className="pt-2 pb-6" />
            <div className="sticky bottom-0 bg-linear-to-t from-canvas from-75% to-transparent pt-6 pb-4 max-md:bottom-[calc(4rem+env(safe-area-inset-bottom))]">
              <ChatComposer id={ASK_INPUT_ID} autoFocus />
              <ComposerNote className="mt-2" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
