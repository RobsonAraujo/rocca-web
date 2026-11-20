/** Route of the open dashboard preview that new waitlist members land on. */
export const PREVIEW_PATH = "/preview"

/** Simulated portfolio page inside the preview. */
export const PORTFOLIO_PATH = "/preview/portfolio"

/** The full Ask Rocca chat (the side panel and the phone sheet open from anywhere). */
export const ASK_PATH = "/preview/ask"

/** Value of `?welcome=` set by the waitlist form after a signup. */
export type WelcomeKind = "new" | "back"
