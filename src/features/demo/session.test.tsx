import { act, render, renderHook, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { illustrations } from "@/features/landing/content"

import {
  DemoSessionProvider,
  initialSession,
  useDemoSession,
  useOptionalDemoSession,
} from "./session"
import { SessionProbe, readSession } from "./test-utils"

function renderSession(
  initial?: Parameters<typeof DemoSessionProvider>[0]["initial"],
) {
  return renderHook(() => useDemoSession(), {
    wrapper: ({ children }) => (
      <DemoSessionProvider initial={initial}>{children}</DemoSessionProvider>
    ),
  })
}

describe("DemoSessionProvider", () => {
  it("starts signed out, with nothing connected", () => {
    render(
      <DemoSessionProvider>
        <SessionProbe />
      </DemoSessionProvider>,
    )
    expect(readSession(screen.getByTestId("session"))).toEqual(initialSession)
  })

  it("signs in, stores the level and connects each account once", () => {
    const { result } = renderSession()

    act(() => result.current.signIn())
    act(() => result.current.setLevel("some"))
    act(() => result.current.connect("Roth IRA"))
    act(() => result.current.connect("Roth IRA"))

    expect(result.current.signedIn).toBe(true)
    expect(result.current.level).toBe("some")
    expect(result.current.connected).toEqual(["Roth IRA"])
    expect(result.current.persona.name).toBe("Maya")
  })

  it("finishing fills in what a direct visit skipped", () => {
    const { result } = renderSession({ connected: ["Crypto"] })

    act(() => result.current.finish())

    expect(result.current).toMatchObject({
      signedIn: true,
      level: "new",
      finished: true,
    })
    expect(result.current.connected[0]).toBe("Crypto")
    expect([...result.current.connected].sort()).toEqual(
      illustrations.accounts.map((a) => a.name).sort(),
    )
  })
})

describe("useOptionalDemoSession", () => {
  it("is null outside the demo, so the preview renders on its own", () => {
    const { result } = renderHook(() => useOptionalDemoSession())
    expect(result.current).toBeNull()
  })
})
