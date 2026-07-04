import { APP_URL } from "./constants";

/**
 * Build the public booking URL an end-user shares / pastes:
 * `${base}/${userName}/${slug}`.
 *
 * Base resolution order:
 *  1. `NEXT_PUBLIC_URL` env var (white-label / staging overrides) —
 *     trailing slash stripped so concatenation is clean.
 *  2. {@link APP_URL} fallback (`"CalHamed.com"` — no scheme; matches the brand).
 *
 * Centralizing here means future tweaks (add `https://`, append UTM args,
 * swap to a different domain strategy) take effect app-wide without hunting
 * call sites.
 *
 * @param userName - The owner's `userName` slug (e.g. `"hamed"`).
 * @param slug     - The event-type's `url` slug (e.g. `"30min-consult"`).
 */
export function buildBookingUrl(userName: string, slug: string): string {
  const base = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "") ?? APP_URL;
  return `${base}/${userName}/${slug}`;
}
