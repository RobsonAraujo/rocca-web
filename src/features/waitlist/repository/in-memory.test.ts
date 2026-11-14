import { describe, expect, it } from "vitest"

import { InMemoryWaitlistRepository } from "./in-memory"

describe("InMemoryWaitlistRepository", () => {
  it("creates an entry the first time an email is inserted", async () => {
    const repository = new InMemoryWaitlistRepository()

    await expect(
      repository.insert({ email: "jane@example.com" }),
    ).resolves.toBe("created")
    expect(repository.size).toBe(1)
  })

  it("returns duplicate for an email that already exists", async () => {
    const repository = new InMemoryWaitlistRepository()
    await repository.insert({ email: "jane@example.com" })

    await expect(
      repository.insert({ email: "jane@example.com" }),
    ).resolves.toBe("duplicate")
    await expect(
      repository.insert({ email: "JANE@example.com" }),
    ).resolves.toBe("duplicate")
    expect(repository.size).toBe(1)
  })

  it("keeps separate instances isolated", async () => {
    const first = new InMemoryWaitlistRepository()
    const second = new InMemoryWaitlistRepository()
    await first.insert({ email: "jane@example.com" })

    await expect(second.insert({ email: "jane@example.com" })).resolves.toBe(
      "created",
    )
  })
})
