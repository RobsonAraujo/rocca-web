"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { comingSoon } from "../data"

/**
 * Every action in the preview lands here. A fixed toast id means repeated
 * clicks refresh one toast instead of stacking several.
 */
export function notifyComingSoon() {
  toast(comingSoon.title, {
    id: "coming-soon",
    description: comingSoon.description,
  })
}

type ComingSoonButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick" | "type"
>

/** A regular Button whose only behavior is the "coming soon" notice. */
export function ComingSoonButton(props: ComingSoonButtonProps) {
  return <Button type="button" {...props} onClick={notifyComingSoon} />
}
