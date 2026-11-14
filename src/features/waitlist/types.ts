/** State returned by the `joinWaitlist` server action and rendered by the form. */
export type WaitlistFormState =
  | { status: "idle" }
  | { status: "success"; alreadyJoined: boolean }
  | {
      status: "error"
      message: string
      /** Echoed back so the input keeps what the user typed. */
      values: { email: string }
    }

export const initialWaitlistState: WaitlistFormState = { status: "idle" }
