/**
 * Typed surface for `process.env` reads used across the app.
 *
 * Currently scoped to:
 *   - `NEXT_PUBLIC_URL` — consumed at runtime in `lib/urls.ts` to build
 *     outgoing booking links (with `APP_URL` fallback).
 *   - `DATABASE_URL` — kept here for symmetry / future consumers.
 *     `prisma.config.ts` does NOT import from this module because Prisma
 *     resolves its URL at config-load time (before the Next app boots)
 *     via `@prisma/config`'s `env()` typed helper, which is independent of
 *     the application runtime.
 *
 * Reading `process.env` eagerly (once at module-load) is safe because
 * `process.env` is immutable for the server lifetime. If/when the app
 * ships a runtime env-var reload story, this module is the single chokepoint
 * to update.
 */
export const env = {
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  DATABASE_URL: process.env.DATABASE_URL,
} as const;
