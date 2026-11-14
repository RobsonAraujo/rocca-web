import type { Metadata } from "next"

import { PortfolioPage } from "@/features/preview/portfolio/portfolio-page"

export const metadata: Metadata = { title: "Portfolio preview" }

export default function PreviewPortfolioPage() {
  return <PortfolioPage />
}
