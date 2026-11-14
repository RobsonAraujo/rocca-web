import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { welcome } from "./data"
import { OverviewScreen } from "./overview-screen"

// vi.mock is hoisted above imports, so shared state must use vi.hoisted.
const search = vi.hoisted(() => ({ params: new URLSearchParams() }))

vi.mock("next/navigation", () => ({ useSearchParams: () => search.params }))
vi.mock("sonner", () => ({ toast: vi.fn() }))

describe("OverviewScreen", () => {
  beforeEach(() => {
    search.params = new URLSearchParams()
  })

  it("renders both layouts; CSS shows the dashboard or the phone home", () => {
    const { container } = render(<OverviewScreen />)

    expect(container.querySelector(".md\\:block")).not.toBeNull()
    expect(container.querySelector(".md\\:hidden")).not.toBeNull()
  })

  it("greets people arriving from the waitlist, once, and can be dismissed", async () => {
    search.params = new URLSearchParams("welcome=new")
    const user = userEvent.setup()
    render(<OverviewScreen />)

    expect(screen.getAllByText(welcome.new.title)).toHaveLength(1)

    await user.click(screen.getByRole("button", { name: welcome.dismiss }))
    expect(screen.queryByText(welcome.new.title)).not.toBeInTheDocument()
  })

  it("shows no greeting when opened directly", () => {
    render(<OverviewScreen />)

    expect(screen.queryByText(welcome.new.title)).not.toBeInTheDocument()
    expect(screen.queryByText(welcome.back.title)).not.toBeInTheDocument()
  })
})
