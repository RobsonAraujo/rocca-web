"use server"

import { WAITLIST_FIELDS } from "./constants"
import { getWaitlistRepository } from "./repository"
import { normalizeSource, waitlistSchema } from "./schema"
import { addToWaitlist } from "./service"
import type { WaitlistFormState } from "./types"

const GENERIC_ERROR = "Something went wrong on our side. Please try again."

export async function joinWaitlist(
  _previousState: WaitlistFormState,
  formData: FormData,
): Promise<WaitlistFormState> {
  // Bots that fill the honeypot get a fake success and nothing is stored.
  const honeypot = formData.get(WAITLIST_FIELDS.honeypot)
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", alreadyJoined: false }
  }

  const rawEmail = formData.get(WAITLIST_FIELDS.email)
  const email = typeof rawEmail === "string" ? rawEmail : ""

  const parsed = waitlistSchema.safeParse({ email })
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Enter a valid email address."
    return { status: "error", message, values: { email } }
  }

  try {
    const result = await addToWaitlist(
      {
        email: parsed.data.email,
        source: normalizeSource(formData.get(WAITLIST_FIELDS.source)),
      },
      getWaitlistRepository(),
    )
    return {
      status: "success",
      alreadyJoined: result.status === "already_joined",
    }
  } catch (error) {
    console.error("[waitlist] Failed to add entry", error)
    return { status: "error", message: GENERIC_ERROR, values: { email } }
  }
}
