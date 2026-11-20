import { describe, expect, it, vi } from "vitest"

import { getNewsProviders } from "."

const names = () => getNewsProviders().map((provider) => provider.name)

describe("getNewsProviders", () => {
  it("tries Massive, then Finnhub, then the simulated headlines", () => {
    vi.stubEnv("MASSIVE_API_KEY", "m1")
    vi.stubEnv("FINNHUB_API_KEY", "f1")
    expect(names()).toEqual(["Massive", "Finnhub", "Simulated"])
  })

  it("uses whichever keys are set", () => {
    vi.stubEnv("MASSIVE_API_KEY", "")
    vi.stubEnv("FINNHUB_API_KEY", "f1")
    expect(names()).toEqual(["Finnhub", "Simulated"])
  })

  it("falls back to simulated headlines without any key", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    vi.stubEnv("MASSIVE_API_KEY", "")
    vi.stubEnv("FINNHUB_API_KEY", "")
    expect(getNewsProviders()).toMatchObject([
      { name: "Simulated", live: false },
    ])
  })
})
