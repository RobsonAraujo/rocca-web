import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { illustrations, preview } from "@/features/landing/content"
import { accountAccess, savings } from "@/features/preview/data"
import { PREVIEW_PATH } from "@/features/preview/constants"

import { demoRoutes } from "./constants"
import { Connect } from "./connect"
import {
  connect as connectCopy,
  firstLook as firstLookCopy,
  onboarding as onboardingCopy,
  persona,
  signIn as signInCopy,
} from "./content"
import { findings } from "./findings"
import { FirstLook } from "./first-look"
import { Onboarding } from "./onboarding"
import { SignIn } from "./sign-in"
import { readSession, renderStep } from "./test-utils"

const router = vi.hoisted(() => ({ push: vi.fn() }))

vi.mock("next/navigation", () => ({ useRouter: () => router }))

const session = () => readSession(screen.getByTestId("session"))

/** jsdom has no matchMedia: stub it, with or without reduced motion. */
function reducedMotion(matches: boolean) {
  vi.stubGlobal("matchMedia", (media: string) => ({
    matches,
    media,
    addEventListener() {},
    removeEventListener() {},
  }))
}

beforeEach(() => router.push.mockReset())
afterEach(() => vi.unstubAllGlobals())

describe("SignIn", () => {
  it("signs the fictional investor in and moves on", async () => {
    const user = userEvent.setup()
    renderStep(<SignIn />)

    expect(screen.getByLabelText(signInCopy.emailLabel)).toHaveValue(
      persona.email,
    )
    expect(screen.getByText(signInCopy.note)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: signInCopy.google }))

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith(demoRoutes.onboarding),
    )
    expect(session().signedIn).toBe(true)
  })
})

describe("Onboarding", () => {
  it("waits for a level, previews the setup, then stores it", async () => {
    const user = userEvent.setup()
    renderStep(<Onboarding />)
    const next = screen.getByRole("button", { name: onboardingCopy.continue })
    expect(next).toBeDisabled()

    await user.click(screen.getByRole("radio", { name: /I'm new to this/ }))

    expect(screen.getByText(onboardingCopy.explain.simple)).toBeInTheDocument()
    expect(screen.getByText(onboardingCopy.autopilot)).toBeInTheDocument()
    expect(screen.getByText(/no single stock above 12%/)).toBeInTheDocument()

    await user.click(next)
    expect(session().level).toBe("new")
    expect(router.push).toHaveBeenCalledWith(demoRoutes.connect)
  })

  it("goes straight to the numbers for experienced investors", async () => {
    const user = userEvent.setup()
    renderStep(<Onboarding />)

    await user.click(screen.getByRole("radio", { name: /I'm experienced/ }))

    expect(screen.getByText(onboardingCopy.explain.numbers)).toBeInTheDocument()
  })
})

describe("Connect", () => {
  it("connects the first broker securely, never asking for a password", async () => {
    const user = userEvent.setup()
    const { container } = renderStep(<Connect />)

    await user.click(screen.getByRole("button", { name: "Fidelity" }))

    const secure = screen.getByRole("region", { name: "Connect Fidelity" })
    expect(
      within(secure).getByText("Rocca never sees or stores your password."),
    ).toBeInTheDocument()
    expect(
      within(secure).getByText(connectCopy.secure.access.view),
    ).toBeInTheDocument()

    await user.click(
      within(secure).getByRole("button", {
        name: connectCopy.secure.open("Fidelity"),
      }),
    )
    expect(
      screen.getByText(connectCopy.secure.opening("Fidelity")),
    ).toBeInTheDocument()
    await user.click(
      await screen.findByRole(
        "button",
        { name: connectCopy.secure.share },
        { timeout: 2000 },
      ),
    )
    expect(
      screen.getByText(connectCopy.secure.syncing("Brokerage")),
    ).toBeInTheDocument()

    const yours = screen.getByRole("region", { name: connectCopy.yours })
    expect(
      await within(yours).findByText(
        "Fidelity · Brokerage",
        {},
        { timeout: 2500 },
      ),
    ).toBeInTheDocument()
    expect(container.querySelector("input[type=password]")).toBeNull()
    expect(session().connected).toEqual(["Brokerage"])
    expect(within(yours).getByText(accountAccess.view)).toBeInTheDocument()
    expect(
      within(yours).getByText(
        connectCopy.remaining(["E*TRADE", "Empower", "Coinbase"]),
      ),
    ).toBeInTheDocument()
  })

  it("connects every account through the same flow, waits included", async () => {
    const user = userEvent.setup()
    renderStep(<Connect />, {
      connected: ["Brokerage", "Roth IRA", "401(k)"],
    })
    const read = screen.getByRole("button", { name: connectCopy.continue })
    expect(read).toBeDisabled()

    await user.click(screen.getByRole("button", { name: "Coinbase" }))
    const secure = screen.getByRole("region", { name: "Connect Coinbase" })
    expect(
      within(secure).getByText(connectCopy.secure.access.trade),
    ).toBeInTheDocument()
    await user.click(
      within(secure).getByRole("button", {
        name: connectCopy.secure.open("Coinbase"),
      }),
    )
    await user.click(
      await screen.findByRole(
        "button",
        { name: connectCopy.secure.share },
        { timeout: 2000 },
      ),
    )
    expect(
      screen.getByText(connectCopy.secure.syncing("Crypto")),
    ).toBeInTheDocument()

    expect(
      await screen.findByText(
        connectCopy.summary(4, preview.portfolio.value.replace(/\.\d+$/, "")),
        {},
        { timeout: 2500 },
      ),
    ).toBeInTheDocument()
    for (const account of illustrations.accounts) {
      expect(
        screen.getByText(`${account.institution} · ${account.name}`),
      ).toBeInTheDocument()
    }
    expect(read).toBeEnabled()
  })

  it("points at the persona's brokers when another one is picked", async () => {
    const user = userEvent.setup()
    renderStep(<Connect />)

    await user.click(screen.getByRole("button", { name: "Webull" }))

    expect(screen.getByText(connectCopy.notHers)).toBeInTheDocument()
  })

  it("reads the accounts, then opens the first look", async () => {
    reducedMotion(false)
    const user = userEvent.setup()
    const all = illustrations.accounts.map((a) => a.name)
    renderStep(<Connect />, { connected: all })

    await user.click(screen.getByRole("button", { name: connectCopy.continue }))

    expect(
      screen.getByRole("region", { name: connectCopy.reading.title }),
    ).toBeInTheDocument()
    await waitFor(
      () => expect(router.push).toHaveBeenCalledWith(demoRoutes.firstLook),
      { timeout: 4000 },
    )
  })

  it("skips the staged reading with reduced motion", async () => {
    reducedMotion(true)
    const user = userEvent.setup()
    const all = illustrations.accounts.map((a) => a.name)
    renderStep(<Connect />, { connected: all })

    await user.click(screen.getByRole("button", { name: connectCopy.continue }))

    expect(router.push).toHaveBeenCalledWith(demoRoutes.firstLook)
  })
})

describe("FirstLook", () => {
  it("shows what no single broker can, then hands off to the dashboard", () => {
    renderStep(<FirstLook />)

    for (const title of [
      firstLookCopy.nvda.title(findings.nvda.total),
      firstLookCopy.savings.title(savings.total),
      firstLookCopy.tax.title(findings.tax.brokerage),
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument()
    }
    const cta = screen.getByRole("link", { name: firstLookCopy.cta })
    expect(cta).toHaveAttribute("href", PREVIEW_PATH)

    // The link's own navigation isn't under test; its click ends the flow.
    cta.addEventListener("click", (event) => event.preventDefault())
    fireEvent.click(cta)
    expect(session().finished).toBe(true)
  })
})

describe("findings", () => {
  it("match the preview's numbers", () => {
    expect(findings.nvda).toEqual({
      total: "22%",
      direct: "18%",
      viaFunds: "4.1%",
      limit: "12%",
    })
    const sum = savings.items.reduce(
      (total, item) => total + Number(item.amount.slice(1)),
      0,
    )
    expect(`$${sum}`).toBe(findings.savings.total)
    expect(findings.tax.brokerage).toBe("~$765")
  })
})
