import { describe, expect, it, vi } from "vitest"

import { createMassiveProvider } from "./massive"

const range = { from: "2026-11-16", to: "2026-11-19" }

const article = {
  id: "abc123",
  publisher: {
    name: "Investing.com",
    homepage_url: "https://www.investing.com/",
    logo_url: "https://s3.massive.com/public/assets/news/logos/investing.png",
    favicon_url:
      "https://s3.massive.com/public/assets/news/favicons/investing.ico",
  },
  title: "Nvidia reports record data center revenue",
  author: "Staff",
  published_utc: "2026-11-19T20:42:00Z",
  article_url: "https://www.investing.com/news/nvda",
  tickers: ["NVDA", "msft"],
  image_url: "https://i-invdn-com.investing.com/news/nvda.jpg",
  description: "Data center sales beat estimates again.",
  keywords: ["earnings"],
  insights: [
    {
      ticker: "NVDA",
      sentiment: "positive",
      sentiment_reasoning: "Record revenue.",
    },
  ],
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

const ok = (results: unknown[]) =>
  jsonResponse({
    status: "OK",
    request_id: "r1",
    count: results.length,
    results,
  })

describe("createMassiveProvider", () => {
  it("maps articles, with the publisher, cover image and tickers", async () => {
    const fetchMock = vi.fn(async () => ok([article]))
    const provider = createMassiveProvider("secret", fetchMock)

    const items = await provider.getCompanyNews(["NVDA"], range)

    expect(items).toEqual([
      {
        id: "massive-abc123",
        headline: article.title,
        summary: article.description,
        source: "Investing.com",
        url: article.article_url,
        image: article.image_url,
        publishedAt: "2026-11-19T20:42:00.000Z",
        tickers: ["NVDA", "MSFT"],
      },
    ])
    expect(provider).toMatchObject({ name: "Massive", live: true })
  })

  it("asks for the newest news per ticker, with the key in a Bearer header", async () => {
    const fetchMock = vi.fn(async () => ok([]))
    await createMassiveProvider("secret", fetchMock).getCompanyNews(
      ["AAPL", "MSFT"],
      range,
    )

    expect(fetchMock).toHaveBeenCalledTimes(2)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [URL, RequestInit]
    expect(url.origin + url.pathname).toBe(
      "https://api.massive.com/v2/reference/news",
    )
    expect(Object.fromEntries(url.searchParams)).toEqual({
      ticker: "AAPL",
      "published_utc.gte": "2026-11-16",
      order: "desc",
      sort: "published_utc",
      limit: "20",
    })
    expect(url.toString()).not.toContain("secret")
    expect(init.headers).toEqual({ Authorization: "Bearer secret" })
  })

  it("falls back to the article's domain when there's no publisher", async () => {
    const fetchMock = vi.fn(async () =>
      ok([{ ...article, publisher: undefined, image_url: "" }]),
    )
    const [item] = await createMassiveProvider("k", fetchMock).getCompanyNews(
      ["NVDA"],
      range,
    )
    expect(item).toMatchObject({
      source: "www.investing.com",
      image: undefined,
    })
  })

  it("skips articles that don't match the expected shape", async () => {
    const fetchMock = vi.fn(async () =>
      ok([article, { id: "x", title: "No url or date" }]),
    )
    const items = await createMassiveProvider("k", fetchMock).getCompanyNews(
      ["NVDA"],
      range,
    )
    expect(items).toHaveLength(1)
  })

  it("treats a response without results as no news", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ status: "OK" }))
    await expect(
      createMassiveProvider("k", fetchMock).getCompanyNews(["NVDA"], range),
    ).resolves.toEqual([])
  })

  it("fails on an HTTP error, so the next provider is tried", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ status: "ERROR" }, 429))
    await expect(
      createMassiveProvider("k", fetchMock).getCompanyNews(["NVDA"], range),
    ).rejects.toThrow(/HTTP 429/)
  })
})
