"use server";

import { signIn } from "@/auth";

/**
 * OAuth providers supported by `signInWithProvider`.
 *
 * SYNCHRONIZATION CONTRACT: this list MUST stay in sync with the
 * `providers[]` array in the root `auth.ts` next-auth config. There is no
 * compile-time check tying the two together (next-auth's `Provider[]` type
 * is per-provider-instance, not a string-union); extending providers means
 * a one-line addition here AND a matching provider entry in `auth.ts`.
 *
 * Mismatch = `signInWithProvider("newprovider")` typechecks here but
 * throws at next-auth's runtime boundary. Reviewers should flag any diff
 * to either side as a dual-file change.
 */
export const AUTH_PROVIDERS = ["google", "github"] as const;
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];

/**
 * Sign the user in with the given OAuth provider. Single entry-point that
 * covers every OAuth provider on offer; consolidates two parallel wrappers
 * (`signInGoogle` + `signInGithub`) that previously duplicated the
 * `signIn(provider)` call verbatim.
 *
 * @param provider - one of {@link AUTH_PROVIDERS}.
 * @throws Re-throws whatever next-auth's `signIn` throws (e.g. on OAuth
 *         rejection by the provider) — the call site decides whether to
 *         catch or let it propagate.
 */
export async function signInWithProvider(
  provider: AuthProvider,
): Promise<void> {
  await signIn(provider);
}

/**
 * @deprecated Call {@link signInWithProvider} directly with `"google"`.
 * Kept as a one-line delegate so existing form-action bindings in
 * `components/AuthModal.tsx` and friends continue to work without edits.
 */
export async function signInGoogle() {
  await signInWithProvider("google");
}

/**
 * @deprecated Call {@link signInWithProvider} directly with `"github"`.
 * Kept as a one-line delegate so existing form-action bindings in
 * `components/AuthModal.tsx` and friends continue to work without edits.
 */
export async function signInGithub() {
  await signInWithProvider("github");
}
