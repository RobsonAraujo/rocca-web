/**
 * Who the card is for:
 * - `portfolio`: the dashboard preview, where each story shows how much of
 *   the (simulated) portfolio it touches.
 * - `public`: the landing, where nobody has connected an account yet, so
 *   stories only name the companies, never "your money".
 */
export type NewsAudience = "portfolio" | "public"

/** Copy for the news card. */
export const newsCopy = {
  /** Badge: `${live} · Massive`. */
  live: "Live",
  simulated: "Simulated headlines",
  /** Footer when live: `${attribution} Massive.` */
  attribution: "Headlines via",
  byAudience: {
    portfolio: {
      title: "News about what you own",
      description: "Only what touches your money.",
      /** Appended to the attribution when live. */
      liveNote: "The portfolio is simulated.",
      simulatedNote: "Sample headlines for the simulated portfolio.",
      empty: "No news about what you own in the last few days.",
      why: "Hot takes and “stocks to buy” lists don't change what you own.",
    },
    public: {
      title: "Today's headlines",
      description: "The companies that move the market, minus the hot takes.",
      liveNote: "",
      simulatedNote: "Sample headlines.",
      empty: "No headlines right now. Check back soon.",
      why: "Hot takes and “stocks to buy” lists aren't news.",
    },
  } satisfies Record<NewsAudience, Record<string, string>>,
  impact: {
    /** "NVDA · 22.1% of your money" */
    total: "of your money",
    /** "AMZN · 2.1% via your funds" (owned only through funds) */
    viaFunds: "via your funds",
    label: "How much of your money this touches",
    /** Public cards list the companies only. */
    companiesLabel: "Companies in this story",
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
