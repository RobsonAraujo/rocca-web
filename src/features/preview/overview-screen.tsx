import { Suspense } from "react"

import { GuidedTour } from "./components/guided-tour"
import { WelcomeBanner } from "./components/welcome-banner"
import { MobileHome } from "./mobile/home"
import { Overview } from "./overview"

/**
 * The /preview screen. Tablets and desktop get the dashboard; phones get
 * the native-app home. Both are rendered and CSS shows one, so the page
 * stays static (no user-agent sniffing, no layout flash).
 *
 * `news` and `mobileNews` are slots for the live news card. The page passes
 * them (each with its own id, since both layouts render), so this screen
 * never fetches anything itself.
 */
export function OverviewScreen({
  news,
  mobileNews,
}: {
  news?: React.ReactNode
  mobileNews?: React.ReactNode
} = {}) {
  return (
    <>
      {/* useSearchParams needs a Suspense boundary to keep the page static. */}
      <Suspense fallback={null}>
        <WelcomeBanner />
        <GuidedTour />
      </Suspense>
      <div className="hidden space-y-6 md:block">
        <Overview news={news} />
      </div>
      <div className="space-y-6 md:hidden">
        <MobileHome news={mobileNews} />
      </div>
    </>
  )
}
