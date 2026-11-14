/**
 * With Cache Components, reading the clock during render must be explicit.
 * "use cache" bakes the year into the static shell and refreshes it on revalidation.
 */
export async function CurrentYear() {
  "use cache"
  return <>{new Date().getFullYear()}</>
}
