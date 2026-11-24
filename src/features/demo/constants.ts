/**
 * Routes of the recordable demo: a simulated first visit, from signing in
 * to the dashboard. `DEMO_PATH` (in features/preview/constants) is a
 * different thing: the landing's "Try the demo" link, straight to /preview.
 */
export const demoRoutes = {
  signIn: "/demo",
  onboarding: "/demo/onboarding",
  connect: "/demo/connect",
  firstLook: "/demo/first-look",
} as const

export type DemoRoute = (typeof demoRoutes)[keyof typeof demoRoutes]

/** The steps in order, for the progress in the demo header. */
export const demoSteps = [
  { path: demoRoutes.signIn, label: "Sign in" },
  { path: demoRoutes.onboarding, label: "About you" },
  { path: demoRoutes.connect, label: "Connect" },
  { path: demoRoutes.firstLook, label: "First look" },
] as const satisfies readonly { path: DemoRoute; label: string }[]

/** The fake "Signing you in…" pause. */
export const SIGN_IN_MS = 700
/** Opening the broker's own sign-in page, in the secure-connection step. */
export const BROKER_MS = 1000
/** A one-click connection, once the first account is linked. */
export const QUICK_CONNECT_MS = 600
/** Each line of the "reading your accounts" checklist. */
export const READ_STEP_MS = 550
