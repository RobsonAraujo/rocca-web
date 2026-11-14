import { beforeEach, describe, expect, it, vi } from "vitest"

import { joinWaitlist } from "./actions"
import { getWaitlistRepository } from "./repository"
import { InMemoryWaitlistRepository } from "./repository/in-memory"
import { initialWaitlistState } from "./types"

vi.mock("./repository", () => ({ getWaitlistRepository: vi.fn() }))

const getRepository = vi.mocked(getWaitlistRepository)

function formData(fields: Record<string, string>) {
  const data = new FormData()
  for (const [key, value] of Object.entries(fields)) data.set(key, value)
  return data
}

describe("joinWaitlist", () => {
  let repository: InMemoryWaitlistRepository

  beforeEach(() => {
    repository = new InMemoryWaitlistRepository()
    getRepository.mockReturnValue(repository)
  })

  it("adds a valid email to the waitlist", async () => {
    const state = await joinWaitlist(
      initialWaitlistState,
      formData({ email: "Jane@Example.com" }),
    )

    expect(state).toEqual({ status: "success", alreadyJoined: false })
    await expect(
      repository.insert({ email: "jane@example.com" }),
    ).resolves.toBe("duplicate")
  })

  it("tells the user when they are already on the list", async () => {
    await joinWaitlist(
      initialWaitlistState,
      formData({ email: "jane@example.com" }),
    )

    const state = await joinWaitlist(
      initialWaitlistState,
      formData({ email: "jane@example.com" }),
    )

    expect(state).toEqual({ status: "success", alreadyJoined: true })
  })

  it("returns a validation error and echoes the typed value", async () => {
    const state = await joinWaitlist(
      initialWaitlistState,
      formData({ email: "jane@" }),
    )

    expect(state).toEqual({
      status: "error",
      message: "Enter a valid email address.",
      values: { email: "jane@" },
    })
    expect(repository.size).toBe(0)
  })

  it("treats a missing email field as empty", async () => {
    const state = await joinWaitlist(initialWaitlistState, new FormData())

    expect(state).toMatchObject({
      status: "error",
      message: "Enter your email address.",
    })
  })

  it("silently accepts bots that fill the honeypot without storing anything", async () => {
    const state = await joinWaitlist(
      initialWaitlistState,
      formData({ email: "bot@example.com", company: "Acme Inc" }),
    )

    expect(state).toEqual({ status: "success", alreadyJoined: false })
    expect(repository.size).toBe(0)
    expect(getRepository).not.toHaveBeenCalled()
  })

  it("forwards a normalized source for attribution", async () => {
    const insert = vi.spyOn(repository, "insert")

    await joinWaitlist(
      initialWaitlistState,
      formData({ email: "jane@example.com", source: "Newsletter" }),
    )

    expect(insert).toHaveBeenCalledWith({
      email: "jane@example.com",
      source: "newsletter",
    })
  })

  it("returns a generic error when the repository fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    getRepository.mockReturnValue({
      insert: vi.fn().mockRejectedValue(new Error("db down")),
    })

    const state = await joinWaitlist(
      initialWaitlistState,
      formData({ email: "jane@example.com" }),
    )

    expect(state).toEqual({
      status: "error",
      message: "Something went wrong on our side. Please try again.",
      values: { email: "jane@example.com" },
    })
    expect(console.error).toHaveBeenCalled()
  })
})
