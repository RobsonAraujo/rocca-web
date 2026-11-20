"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type NewsImageProps = {
  /** Cover image URL; without one (or if it fails) the ticker tile shows. */
  src?: string
  /** The story's link: the image opens it too, like on a news site. */
  href?: string
  /** The ticker the story touches most, shown on the fallback tile. */
  symbol: string
  featured?: boolean
  className?: string
}

/**
 * A story's cover image, or a tinted tile with its ticker when there is none
 * or it fails to load. Decorative: the headline next to it carries the
 * meaning, so it's hidden from assistive tech and skipped by keyboard focus.
 *
 * A plain <img>, not next/image: covers come from any publisher's host, and
 * allowing every host in the optimizer would turn it into an open proxy.
 */
export function NewsImage({
  src,
  href,
  symbol,
  featured = false,
  className,
}: NewsImageProps) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // An image that failed before hydration never fires onError on the client.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  const content =
    src && !failed ? (
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
    ) : (
      <span
        data-slot="news-image-fallback"
        className={cn(
          "grid size-full place-items-center bg-brand/10 font-semibold tracking-tight text-brand",
          featured ? "text-3xl sm:text-4xl" : "text-xs",
        )}
      >
        {symbol}
      </span>
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
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}
