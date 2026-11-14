import { describe, expect, it, vi } from "vitest"

import { InMemoryWaitlistRepository } from "./repository/in-memory"
import type { WaitlistRepository } from "./repository/types"
import { addToWaitlist } from "./service"

describe("addToWaitlist", () => {
  it("joins a new email", async () => {
    const repository = new InMemoryWaitlistRepository()

    await expect(
      addToWaitlist({ email: "jane@example.com" }, repository),
    ).resolves.toEqual({
      status: "joined",
    })
    expect(repository.size).toBe(1)
  })

  it("reports an email that is already on the list, regardless of case", async () => {
    const repository = new InMemoryWaitlistRepository()
    await addToWaitlist({ email: "jane@example.com" }, repository)

    await expect(
      addToWaitlist({ email: " JANE@example.com" }, repository),
    ).resolves.toEqual({
      status: "already_joined",
    })
    expect(repository.size).toBe(1)
  })

  it("passes a normalized entry to the repository", async () => {
    const insert = vi
      .fn<WaitlistRepository["insert"]>()
      .mockResolvedValue("created")

    await addToWaitlist(
      { email: " Jane@Example.com ", source: "twitter" },
      { insert },
    )

    expect(insert).toHaveBeenCalledWith({
      email: "jane@example.com",
      source: "twitter",
    })
  })

  it("lets repository failures bubble up to the caller", async () => {
    const insert = vi
      .fn<WaitlistRepository["insert"]>()
      .mockRejectedValue(new Error("db down"))

    await expect(
      addToWaitlist({ email: "jane@example.com" }, { insert }),
    ).rejects.toThrow("db down")
  })
})
