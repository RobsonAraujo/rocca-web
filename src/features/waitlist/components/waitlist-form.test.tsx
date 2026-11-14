import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { afterEach, describe, expect, it, vi } from "vitest"

import { joinWaitlist } from "../actions"
import type { WaitlistFormState } from "../types"
import { WaitlistForm } from "./waitlist-form"

// vi.mock is hoisted above imports, so the router must be created with vi.hoisted.
const router = vi.hoisted(() => ({ push: vi.fn(), prefetch: vi.fn() }))

vi.mock("next/navigation", () => ({ useRouter: () => router }))
vi.mock("../actions", () => ({ joinWaitlist: vi.fn() }))
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }))

const action = vi.mocked(joinWaitlist)

async function submit(email: string) {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText("Email address"), email)
  await user.click(screen.getByRole("button", { name: "Join the waitlist" }))
}

describe("WaitlistForm", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/")
  })

  it("renders an accessible email field and submit button", () => {
    render(<WaitlistForm />)

    const input = screen.getByLabelText("Email address")
    expect(input).toHaveAttribute("type", "email")
    expect(input).toBeRequired()
    expect(
      screen.getByRole("button", { name: "Join the waitlist" }),
    ).toBeEnabled()
  })

  it("shows the success state after joining", async () => {
    action.mockResolvedValue({ status: "success", alreadyJoined: false })
    render(<WaitlistForm />)

    await submit("jane@example.com")

    expect(await screen.findByRole("status")).toHaveTextContent(
      "You're on the list.",
    )
    expect(screen.queryByLabelText("Email address")).not.toBeInTheDocument()
  })

  it("tells returning users they are already on the list", async () => {
    action.mockResolvedValue({ status: "success", alreadyJoined: true })
    render(<WaitlistForm />)

    await submit("jane@example.com")

    expect(await screen.findByRole("status")).toHaveTextContent(
      "You're already on the list.",
    )
  })

  it("shows the error inline and keeps the typed email", async () => {
    action.mockResolvedValue({
      status: "error",
      message: "Something went wrong on our side. Please try again.",
      values: { email: "jane@example.com" },
    } satisfies WaitlistFormState)
    render(<WaitlistForm />)

    await submit("jane@example.com")

    const alert = await screen.findByRole("alert")
    expect(alert).toHaveTextContent("Something went wrong on our side.")
    const input = screen.getByLabelText("Email address")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveValue("jane@example.com")
  })

  it("sends the email, utm_source and empty honeypot to the server action", async () => {
    window.history.replaceState({}, "", "/?utm_source=newsletter")
    action.mockResolvedValue({ status: "success", alreadyJoined: false })
    render(<WaitlistForm />)

    await submit("jane@example.com")
    await screen.findByRole("status")

    const data = action.mock.calls[0]?.[1]
    expect(data).toBeInstanceOf(FormData)
    expect(data?.get("email")).toBe("jane@example.com")
    expect(data?.get("source")).toBe("newsletter")
    expect(data?.get("company")).toBe("")
  })

  it("behaves the same in the pill variant", async () => {
    action.mockResolvedValue({ status: "success", alreadyJoined: false })
    render(<WaitlistForm variant="pill" />)

    expect(screen.getByLabelText("Email address")).toBeRequired()
    await submit("jane@example.com")

    expect(await screen.findByRole("status")).toHaveTextContent(
      "You're on the list.",
    )
  })

  it("stays on the page and toasts when no successHref is given", async () => {
    action.mockResolvedValue({ status: "success", alreadyJoined: false })
    render(<WaitlistForm />)

    await submit("jane@example.com")
    await screen.findByRole("status")

    expect(toast.success).toHaveBeenCalledWith("You're on the list.")
    expect(router.push).not.toHaveBeenCalled()
  })

  it("opens the success page with welcome=new after joining", async () => {
    action.mockResolvedValue({ status: "success", alreadyJoined: false })
    render(<WaitlistForm successHref="/preview" />)
    expect(router.prefetch).toHaveBeenCalledWith("/preview")

    await submit("jane@example.com")

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Opening your dashboard preview",
    )
    expect(router.push).toHaveBeenCalledWith("/preview?welcome=new")
    expect(toast.success).not.toHaveBeenCalled()
  })

  it("marks returning members with welcome=back", async () => {
    action.mockResolvedValue({ status: "success", alreadyJoined: true })
    render(<WaitlistForm successHref="/preview" />)

    await submit("jane@example.com")
    await screen.findByRole("status")

    expect(router.push).toHaveBeenCalledWith("/preview?welcome=back")
  })

  it("does not navigate when joining fails", async () => {
    action.mockResolvedValue({
      status: "error",
      message: "Something went wrong on our side. Please try again.",
      values: { email: "jane@example.com" },
    })
    render(<WaitlistForm successHref="/preview" />)

    await submit("jane@example.com")
    await screen.findByRole("alert")

    expect(router.push).not.toHaveBeenCalled()
  })
})
