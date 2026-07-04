import { APP_URL, ROUTES } from "./constants";
import { env } from "./env";

/**
 * Normalize a base URL into an absolute URL by adding a scheme if one is
 * missing. `https://` is the default — `http://` is used when the host
 * contains `localhost` (covers `localhost`, `127.0.0.1`, `localhost:3000`
 * etc. for `next dev`).
 *
 * Trailing slashes are stripped before the scheme check so
 * `withScheme("CalHamed.com/") === "https://CalHamed.com"`.
 *
 * SSOT for absolute-URL construction: shared with {@link buildBookingUrl}
 * and `lib/nylas.ts`'s Nylas OAuth `callbackUri` so the scheme strategy
 * stays in one place — a future change (e.g. always-https, or per-env
 * scheme) ripples to every consumer in a single edit.
 *
 * @param base - hostname-with-optional-scheme (may be bare `CalHamed.com`
 *               or null/empty in the env-missing edge case).
 * @returns An absolute URL with a scheme.
 */
export function withScheme(base: string): string {
  const trimmed = base.replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return trimmed.includes("localhost") ? `http://${trimmed}` : `https://${trimmed}`;
}

/**
 * Build the public booking URL an end-user shares / pastes:
 * `${base}/${userName}/${slug}`.
 *
 * Base resolution order:
 *  1. `NEXT_PUBLIC_URL` env var (white-label / staging overrides) —
 *     trailing slash stripped so concatenation is clean.
 *  2. {@link APP_URL} fallback (`"CalHamed.com"` — no scheme; matches the
 *     brand and is auto-prefixed by {@link withScheme}).
 *
 * The returned URL is always absolute (has a scheme), making it safe to:
 *  - paste into Nylas invite emails / a user's address bar
 *  - use as `<Link href>` (Next.js treats scheme-less strings as relative
 *    paths and would 404 inside the dashboard route group).
 *  - feed into share dialogs / QR codes / CRM exports.
 *
 * Centralizing here means future tweaks (append UTM args, swap to a
 * different domain strategy) take effect app-wide without hunting call
 * sites.
 *
 * @param userName - The owner's `userName` slug (e.g. `"hamed"`).
 * @param slug     - The event-type's `url` slug (e.g. `"30min-consult"`).
 */
export function buildBookingUrl(userName: string, slug: string): string {
  const base = withScheme(env.NEXT_PUBLIC_URL ?? APP_URL);
  return `${base}/${userName}/${slug}`;
}

/**
 * Build the dashboard event-type edit/delete route.
 * Wraps {@link ROUTES.DASHBOARD_EVENT} (`"/dashboard/event"`) plus the
 * database id, optionally ending in `/delete`.
 *
 * Replaces four inline `${ROUTES.DASHBOARD_EVENT}/${id}` template uses in
 * `app/dashboard/page.tsx` (3 edit-mode Link hrefs plus 1 delete-mode
 * DropdownMenu Link) so adding a future sub-route (e.g. `/analytics`)
 * flips a one-line change here instead of a multi-file swap.
 *
 * @param id   - The EventType database id.
 * @param mode - `"edit"` returns `${base}/${id}`; `"delete"` returns
 *               `${base}/${id}/delete`. Defaults to `"edit"`.
 */
export function buildEventTypeUrl(
  id: string,
  mode: "edit" | "delete" = "edit",
): string {
  const base = `${ROUTES.DASHBOARD_EVENT}/${id}`;
  return mode === "delete" ? `${base}/delete` : base;
}
