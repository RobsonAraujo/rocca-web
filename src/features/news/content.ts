/** Copy for the news card. */
export const newsCopy = {
  title: "News about what you own",
  description: "Only what touches your money.",
  /** Badge: `${live} · Finnhub`. */
  live: "Live",
  simulated: "Simulated headlines",
  /** Footer when live: `${attribution} Finnhub. ${liveNote}` */
  attribution: "Headlines via",
  liveNote: "The portfolio is simulated.",
  simulatedNote: "Sample headlines for the simulated portfolio.",
  empty: "No news about what you own in the last few days.",
  impact: {
    /** "NVDA · 22.1% of your money" */
    total: "of your money",
    /** "AMZN · 2.1% via your funds" (owned only through funds) */
    viaFunds: "via your funds",
    label: "How much of your money this touches",
  },
  hidden: {
    /** "Rocca hid 3 opinion pieces" */
    prefix: "Rocca hid",
    one: "opinion piece",
    many: "opinion pieces",
    show: "Show",
    hide: "Hide",
    tag: "Opinion",
    why: "Hot takes and “stocks to buy” lists don't change what you own.",
  },
  opensInNewTab: "(opens in a new tab)",
  loading: "Loading headlines…",
} as const
