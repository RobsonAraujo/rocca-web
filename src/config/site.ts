/**
 * Single source of truth for brand-level values (name, copy used in metadata,
 * canonical URL). Change the product name here, nowhere else.
 */
export const siteConfig = {
  name: "Rocca",
  title: "Rocca: your AI investing agent",
  description:
    "Rocca connects every account you own, explains every move in plain English, and turns ideas into trades on your terms, so you learn as you go.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const
