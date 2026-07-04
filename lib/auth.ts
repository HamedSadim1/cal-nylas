import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "@/auth";

/**
 * Single source of truth for auth/grant-related error messages.
 * Update these strings here; they are reused across Server Actions, Route Handlers,
 * and middleware to avoid subtle copy-paste drift.
 */
export const AUTH_ERRORS = {
  UNAUTHENTICATED: "User not authenticated",
  NYLAS_NOT_CONNECTED: "User has not connected their calendar",
} as const;

export interface RequireUserOptions {
  /**
   * If set, unauthenticated callers are redirected here instead of throwing.
   * Use in Server Components / Layouts / Pages (i.e. anywhere `redirect()` is valid).
   */
  redirectTo?: string;
  /**
   * Custom error message thrown when caller is unauthenticated and no
   * `redirectTo` is provided. Defaults to {@link AUTH_ERRORS.UNAUTHENTICATED}.
   * Useful for integrations like UploadThing that expect a specific message.
   */
  errorMessage?: string;
}

/**
 * Server-side guard that returns the authenticated session.
 *
 * Behavior:
 * - If `options.redirectTo` is set, an unauthenticated caller is redirected there
 *   (use this in Server Components / Layouts / Pages).
 * - Otherwise an unauthenticated caller throws `new Error(options.errorMessage ?? AUTH_ERRORS.UNAUTHENTICATED)`
 *   (use this in Server Actions, where throwing is the canonical way to abort).
 *
 * The returned session is narrowed so `session.user.id` is a non-null `string`.
 *
 * @example Server Component
 * ```ts
 * const session = await requireUser({ redirectTo: ROUTES.HOME });
 * ```
 *
 * @example Server Action
 * ```ts
 * const session = await requireUser();
 * ```
 *
 * @example UploadThing middleware (keeps the original "Unauthorized" message)
 * ```ts
 * const session = await requireUser({ errorMessage: "Unauthorized" });
 * ```
 */
export async function requireUser(
  options: RequireUserOptions = {},
): Promise<Session & { user: { id: string } }> {
  const session = await auth();
  if (!session?.user?.id) {
    if (options.redirectTo) redirect(options.redirectTo);
    throw new Error(options.errorMessage ?? AUTH_ERRORS.UNAUTHENTICATED);
  }
  return session as Session & { user: { id: string } };
}

/**
 * Returns the user's Nylas grant info with both fields narrowed to non-null `string`.
 *
 * Throws {@link AUTH_ERRORS.NYLAS_NOT_CONNECTED} when either `grantId` or
 * `grantEmail` is missing — use this immediately after loading the user
 * (or a join that exposes these two fields) and before any Nylas call.
 *
 * Accepts `null | undefined` so it composes with `data?.User`-style optional chains.
 */
export function requireNylasGrant(
  user:
    { grantId: string | null; grantEmail: string | null } | null | undefined,
): { grantId: string; grantEmail: string } {
  if (!user?.grantId || !user?.grantEmail) {
    throw new Error(AUTH_ERRORS.NYLAS_NOT_CONNECTED);
  }
  return { grantId: user.grantId, grantEmail: user.grantEmail };
}
