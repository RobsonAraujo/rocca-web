/**
 * Who the card is for:
 * - `portfolio`: the dashboard preview, where each story shows how much of
 *   the (simulated) portfolio it touches.
 * - `public`: the landing, where nobody has connected an account yet, so
 *   stories only name the companies, never "your portfolio".
 */
export type NewsAudience = "portfolio" | "public"

/** Copy for the news card. */
export const newsCopy = {
  /** Header status when the headlines are live. */
  live: "Live",
  /** Header status for the simulated fallback. */
  simulated: "Sample headlines",
  /** Footer when live: `${attribution} Massive.` */
  attribution: "Headlines via",
  byAudience: {
    portfolio: {
      title: "News about what you own",
      /** Appended to the attribution when live. */
      liveNote: "The portfolio is simulated.",
      simulatedNote: "Sample headlines for the simulated portfolio.",
      empty: "No news about what you own in the last few days.",
      why: "Hot takes and “stocks to buy” lists don't change what you own.",
    },
    public: {
      title: "Today's headlines",
      liveNote: "",
      simulatedNote: "Sample headlines.",
      empty: "No headlines right now. Check back soon.",
      why: "Hot takes and “stocks to buy” lists aren't news.",
    },
  } satisfies Record<NewsAudience, Record<string, string>>,
  impact: {
    /** "23.9% of your portfolio" */
    total: "of your portfolio",
    /** "2.1% of your portfolio, via your funds" (owned only through funds) */
    viaFunds: "via your funds",
  },
  hidden: {
    /** "Rocca hid 3 opinion pieces" */
    prefix: "Rocca hid",
    one: "opinion piece",
    many: "opinion pieces",
    show: "Show",
    hide: "Hide",
    tag: "Opinion",
  },
  opensInNewTab: "(opens in a new tab)",
  loading: "Loading headlines…",
} as const
