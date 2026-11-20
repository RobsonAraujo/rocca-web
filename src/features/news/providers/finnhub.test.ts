import { describe, expect, it, vi } from "vitest"

import { createFinnhubProvider } from "./finnhub"

const range = { from: "2026-11-16", to: "2026-11-19" }

const article = {
  category: "company",
  datetime: 1_795_100_000,
  headline: "Nvidia reports record data center revenue",
  id: 42,
  image: "",
  related: "NVDA,msft",
  source: "Reuters",
  summary: "",
  url: "https://example.com/nvda",
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

describe("createFinnhubProvider", () => {
  it("maps company news and merges the related tickers", async () => {
    const fetchMock = vi.fn(async () => jsonResponse([article]))
    const provider = createFinnhubProvider("secret", fetchMock)

    const items = await provider.getCompanyNews(["NVDA"], range)

    expect(items).toEqual([
      {
        id: "finnhub-42",
        headline: article.headline,
        summary: undefined,
        source: "Reuters",
        url: article.url,
        publishedAt: new Date(article.datetime * 1000).toISOString(),
        tickers: ["NVDA", "MSFT"],
      },
    ])
    expect(provider).toMatchObject({ name: "Finnhub", live: true })
  })

  it("keeps https cover images and drops http or empty ones", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse([
        {
          ...article,
          id: 1,
          url: "https://e.com/1",
          image: "https://cdn.e.com/a.jpg",
        },
        {
          ...article,
          id: 2,
          url: "https://e.com/2",
          image: "http://cdn.e.com/b.jpg",
        },
        { ...article, id: 3, url: "https://e.com/3", image: "" },
      ]),
    )
    const items = await createFinnhubProvider("k", fetchMock).getCompanyNews(
      ["NVDA"],
      range,
    )
    expect(items.map((item) => item.image)).toEqual([
      "https://cdn.e.com/a.jpg",
      undefined,
      undefined,
    ])
  })

  it("sends the key in a header, never in the URL", async () => {
    const fetchMock = vi.fn(async () => jsonResponse([]))
    await createFinnhubProvider("secret", fetchMock).getCompanyNews(
      ["AAPL"],
      range,
    )

    const [url, init] = fetchMock.mock.calls[0] as unknown as [URL, RequestInit]
    expect(url.toString()).toBe(
      "https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2026-11-16&to=2026-11-19",
    )
    expect(url.toString()).not.toContain("secret")
    expect(init.headers).toEqual({ "X-Finnhub-Token": "secret" })
  })

  it("asks once per ticker", async () => {
    const fetchMock = vi.fn(async () => jsonResponse([]))
    await createFinnhubProvider("k", fetchMock).getCompanyNews(
      ["NVDA", "AAPL", "MSFT"],
      range,
    )
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it("skips articles that don't match the expected shape", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse([article, { id: 1, headline: "No url or time" }]),
    )
    const items = await createFinnhubProvider("k", fetchMock).getCompanyNews(
      ["NVDA"],
      range,
    )
    expect(items).toHaveLength(1)
  })

  it("fails on an HTTP error, so the caller can fall back", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ error: "limit" }, 429))
    await expect(
      createFinnhubProvider("k", fetchMock).getCompanyNews(["NVDA"], range),
    ).rejects.toThrow(/HTTP 429/)
  })
})
