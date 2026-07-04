import { APP_URL, ROUTES } from "./constants";
import { env } from "./env";

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
  const base = env.NEXT_PUBLIC_URL?.replace(/\/$/, "") ?? APP_URL;
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
