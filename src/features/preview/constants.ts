/** Route of the open dashboard preview that new waitlist members land on. */
export const PREVIEW_PATH = "/preview"

/** Simulated portfolio page inside the preview. */
export const PORTFOLIO_PATH = "/preview/portfolio"

/** The full Ask Rocca chat (the side panel and the phone sheet open from anywhere). */
export const ASK_PATH = "/preview/ask"

/**
 * Value of `?welcome=`. The waitlist form sets `new` or `back` after a
 * signup; `demo` comes from the landing's "Try the demo" links, for people
 * (investors, the curious) who look before they join.
 */
export type WelcomeKind = "new" | "back" | "demo"

/** Opens the preview without signing up; it greets visitors as a demo. */
export const DEMO_PATH = `${PREVIEW_PATH}?welcome=demo`
