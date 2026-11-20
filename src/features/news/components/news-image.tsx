"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type NewsImageProps = {
  /** Cover image URL. Without one, or if it fails, nothing renders. */
  src?: string
  /** The story's link: the image opens it too, like on a news site. */
  href?: string
  className?: string
}

/**
 * A story's cover photo. Decorative: the headline next to it carries the
 * meaning, so it's hidden from assistive tech and skipped by keyboard focus.
 * No photo means no image at all (news sites don't fill the gap with a
 * placeholder), so the story simply reads as text.
 *
 * A plain <img>, not next/image: covers come from any publisher's host, and
 * allowing every host in the optimizer would turn it into an open proxy.
 */
export function NewsImage({ src, href, className }: NewsImageProps) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // An image that failed before hydration never fires onError on the client.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  if (!src || failed) return null

  const image = (
    // eslint-disable-next-line @next/next/no-img-element -- see the note above
    <img
      ref={imgRef}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="size-full object-cover"
    />
  )

  return (
    <div aria-hidden className={cn("overflow-hidden bg-secondary", className)}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          className="block size-full"
        >
          {image}
        </a>
      ) : (
        image
      )}
    </div>
  )
}
