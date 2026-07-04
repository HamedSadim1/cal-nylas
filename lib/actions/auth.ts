"use server";

import { signIn } from "@/auth";

// NOTE: a `"use server"` file can only export async functions — the bundler
// rejects any plain-object / type-only exports with
// `A "use server" file can only export async functions, found object.`
// That excludes a typed-but-exported `AUTH_PROVIDERS = [...] as const`
// registry here, even though its only accessor is the parameter type
// just below. The provider list stays inline as a literal-union on
// `signInWithProvider`'s parameter — keep both in sync with `auth.ts`'s
// `providers[]` (see the SYNC note in the JSDoc).

/**
 * Sign the user in with the given OAuth provider. Single entry-point that
 * covers every OAuth provider on offer; consolidates two parallel wrappers
 * (`signInGoogle` + `signInGithub`) that previously duplicated the
 * `signIn(provider)` call verbatim.
 *
 * SYNCHRONIZATION CONTRACT: the `"google" | "github"` union MUST stay in
 * sync with the `providers[]` array in the root `auth.ts` next-auth config.
 * There is no compile-time check tying the two together (next-auth's
 * `Provider[]` type is per-provider-instance, not a string-union);
 * extending providers means a one-line addition to BOTH this union AND
 * the matching provider entry in `auth.ts`.
 *
 * @param provider - one of the OAuth provider ids configured in `auth.ts`.
 * @throws Re-throws whatever next-auth's `signIn` throws (e.g. on OAuth
 *         rejection by the provider) — the call site decides whether to
 *         catch or let it propagate.
 */
export async function signInWithProvider(
  provider: "google" | "github",
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
