import { z } from "zod"

const httpsUrl = z.url({ protocol: /^https$/ })

/**
 * Keeps only https image URLs: an http one would be blocked as mixed
 * content, and an empty or broken one is no image at all.
 */
export function coverImage(image: string | null | undefined) {
  return image && httpsUrl.safeParse(image).success ? image : undefined
}
