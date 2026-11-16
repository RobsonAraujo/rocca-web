import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TOUR_STORAGE_KEY } from "./components/guided-tour"
import { tour, welcome } from "./data"
import { OverviewScreen } from "./overview-screen"
import { renderWithDemo } from "./test-utils"

// vi.mock is hoisted above imports, so shared state must use vi.hoisted.
const search = vi.hoisted(() => ({ params: new URLSearchParams() }))

vi.mock("next/navigation", () => ({ useSearchParams: () => search.params }))
vi.mock("sonner", () => ({ toast: vi.fn() }))

describe("OverviewScreen", () => {
  beforeEach(() => {
    search.params = new URLSearchParams()
    window.localStorage.clear()
  })

  it("renders both layouts; CSS shows the dashboard or the phone home", () => {
    const { container } = renderWithDemo(<OverviewScreen />)

    expect(container.querySelector(".md\\:block")).not.toBeNull()
    expect(container.querySelector(".md\\:hidden")).not.toBeNull()
  })

  it("greets people arriving from the waitlist, once, and can be dismissed", async () => {
    search.params = new URLSearchParams("welcome=new")
    const user = userEvent.setup()
    renderWithDemo(<OverviewScreen />)

    expect(screen.getAllByText(welcome.new.title)).toHaveLength(1)

    await user.click(screen.getByRole("button", { name: welcome.dismiss }))
    expect(screen.queryByText(welcome.new.title)).not.toBeInTheDocument()
  })

  it("shows no greeting when opened directly", () => {
    renderWithDemo(<OverviewScreen />)

    expect(screen.queryByText(welcome.new.title)).not.toBeInTheDocument()
    expect(screen.queryByText(welcome.back.title)).not.toBeInTheDocument()
  })

  it("starts the tour after a signup, and remembers when it's skipped", async () => {
    search.params = new URLSearchParams("welcome=new")
    const user = userEvent.setup()
    renderWithDemo(<OverviewScreen />)

    const dialog = await screen.findByRole(
      "dialog",
      { name: tour.steps[0].title },
      { timeout: 3000 },
    )
    await user.click(within(dialog).getByRole("button", { name: tour.next }))
    expect(
      screen.getByRole("dialog", { name: tour.steps[1].title }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: tour.skip }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(window.localStorage.getItem(TOUR_STORAGE_KEY)).toBe("1")
  })

  it("skips the tour for returning members and finished tours", async () => {
    search.params = new URLSearchParams("welcome=back")
    const { unmount } = renderWithDemo(<OverviewScreen />)
    await new Promise((resolve) => setTimeout(resolve, 1700))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    unmount()

    search.params = new URLSearchParams("welcome=new")
    window.localStorage.setItem(TOUR_STORAGE_KEY, "1")
    renderWithDemo(<OverviewScreen />)
    await new Promise((resolve) => setTimeout(resolve, 1700))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
