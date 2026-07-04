import { z } from "zod/v4";
import { conformZodMessage } from "@conform-to/zod/v4";
import { VALIDATION } from "@/lib/constants";

// ─── Onboarding schemas (DRY base + .extend) ───────────────────────────────
// Same shape as the eventType schemas below: the unchanging field lives on a
// shared base, and each client adds `username` via `.extend({ username: ... })`.
// The `onboardingSchemaLocale` (static) client uses `onboardingUsernameSchema`
// directly; `onboardingSchema` (async) pipes the SSOT username through a
// Conform `superRefine` that consults `options.isUsernameUnique()`.
//
// Why `.extend` instead of inline `z.object({...})`: zod 4's `.extend` is
// additive-only — keeps the intent clear ("the only field that changes is
// username, and `fullName` is shared") and future-proof if zod semantics
// ever shift. Same trade-off documented for `eventTypeBaseSchema`.

/**
 * SSOT for the onboarding username slug. Bounds (USERNAME_MIN/MAX from
 * `lib/constants.ts`) + the `^[a-zA-Z0-9-]+$` charset rule. Both clients
 * derive their username validator from this — a one-file edit widens or
 * narrows the rule for the whole app.
 */
const onboardingUsernameSchema = z
  .string()
  .min(VALIDATION.USERNAME_MIN)
  .max(VALIDATION.USERNAME_MAX)
  .regex(/^[a-zA-Z0-9-]+$/, {
    message: "Username must contain only letters, numbers, and hyphens",
  });

/** Shared base: only `fullName`. `username` is intentionally absent so each
 *  client can `.extend({ username: ... })` with its own validator. */
const onboardingBaseSchema = z.object({
  fullName: z.string().min(VALIDATION.NAME_MIN).max(VALIDATION.NAME_MAX),
});

/**
 * Client/Locale-facing schema (used for static validation that doesn't need
 * the async DB uniqueness check — e.g. early build-time / locale probing).
 */
export const onboardingSchemaLocale = onboardingBaseSchema.extend({
  username: onboardingUsernameSchema,
});

/**
 * Server-facing schema (used by Conform with
 * `parseWithZod(formData, { schema, async: true })`).
 *
 * Inherits the base + SSOT username format, then `.pipe()`s a `superRefine`
 * that consults `options.isUsernameUnique()` against the database. Conform's
 * idiom: the async aspect isn't expressible synchronously, so when this
 * validator runs on the client (without `options`) it surfaces
 * `VALIDATION_UNDEFINED` — making Conform fall back to the server action for
 * the real check. On the server the pipe's promise resolves and a duplicate
 * username is rejected with "Username is already used".
 */
export function onboardingSchema(options?: {
  isUsernameUnique: () => Promise<boolean>;
}) {
  return onboardingBaseSchema.extend({
    username: onboardingUsernameSchema.pipe(
      // Note: The callback cannot be async here
      // As we run zod validation synchronously on the client
      z.string().superRefine((_, ctx) => {
        // This makes Conform to fallback to server validation
        // by indicating that the validation is not defined
        if (typeof options?.isUsernameUnique !== "function") {
          ctx.addIssue({
            code: "custom",
            message: conformZodMessage.VALIDATION_UNDEFINED,
            fatal: true,
          });
          return;
        }

        // If it reaches here, then it must be validating on the server
        // Return the result as a promise so Zod knows it's async instead
        return options.isUsernameUnique().then((isUnique) => {
          if (!isUnique) {
            ctx.addIssue({
              code: "custom",
              message: "Username is already used",
            });
          }
        });
      }),
    ),
  });
}

export const aboutSettingsSchema = z.object({
  fullName: z.string().min(VALIDATION.NAME_MIN).max(VALIDATION.NAME_MAX),

  profileImage: z.string(),
});

// ─── EventType schemas (DRY base + .extend) ─────────────────────────────────
// Shared by the client (eventTypeSchema) and the server-augmented validator
// (EventTypeServerSchema). The 4 unchanging fields live here; `url` is the
// only field that legitimately differs (server adds a DB-uniqueness check via
// a `.pipe(z.string().superRefine(...))`, client cannot run async).
//
// Why `.extend` instead of inline `z.object({...})`: zod 4's `.extend` only
// adds new fields, never shadows — so the base stays intent-clear and a
// future zod-version bump doesn't accidentally start/quits supporting the
// override branch. The base/derivative split also keeps the new `url` SSOT
// (`eventTypeUrlSchema`) in a single place instead of duplicated across two
// flat objects.
const eventTypeBaseSchema = z.object({
  title: z.string().min(VALIDATION.TITLE_MIN).max(VALIDATION.TITLE_MAX),
  duration: z
    .number()
    .min(VALIDATION.DURATION_MIN)
    .max(VALIDATION.DURATION_MAX),
  description: z
    .string()
    .min(VALIDATION.DESCRIPTION_MIN)
    .max(VALIDATION.DESCRIPTION_MAX),
  videoCallSoftware: z.string(),
});

/**
 * SSOT for the eventType slug (`url`) format used in booking-page URLs
 * (e.g. `/<userName>/<url>`). Both the client schema and the server schema
 * derive their url validators from this — keeps the bounds in one place so
 * loosening/tightening `URL_MIN` / `URL_MAX` in `lib/constants.ts`
 * automatically widens both branches.
 */
const eventTypeUrlSchema = z
  .string()
  .min(VALIDATION.URL_MIN)
  .max(VALIDATION.URL_MAX);

/**
 * Client-facing schema (used in browser forms). Adds the SSOT url validator
 * to the base. Cannot run async DB checks so no uniqueness lookup here.
 */
export const eventTypeSchema = eventTypeBaseSchema.extend({
  url: eventTypeUrlSchema,
});

/**
 * Server-facing schema (used by Conform with
 * `parseWithZod(formData, { schema, async: true })`).
 *
 * Inherits the base + SSOT url format, then `.pipe()`s a `superRefine` that
 * consults `options.isUrlUnique()` against the database. Conform's idiom:
 * the async aspect isn't expressible synchronously, so when this validator
 * runs on the client (without `options`) it surfaces `VALIDATION_UNDEFINED`
 * — making Conform fall back to the server action for the real check. On
 * the server the pipe's promise resolves and a duplicate url is rejected
 * with "Url is already used".
 */
export function EventTypeServerSchema(options?: {
  isUrlUnique: () => Promise<boolean>;
}) {
  return eventTypeBaseSchema.extend({
    url: eventTypeUrlSchema.pipe(
      // Note: The callback cannot be async here
      // As we run zod validation synchronously on the client
      z.string().superRefine((_, ctx) => {
        // This makes Conform to fallback to server validation
        // by indicating that the validation is not defined
        if (typeof options?.isUrlUnique !== "function") {
          ctx.addIssue({
            code: "custom",
            message: conformZodMessage.VALIDATION_UNDEFINED,
            fatal: true,
          });
          return;
        }

        // If it reaches here, then it must be validating on the server
        // Return the result as a promise so Zod knows it's async instead
        return options.isUrlUnique().then((isUnique) => {
          if (!isUnique) {
            ctx.addIssue({
              code: "custom",
              message: "Url is already used",
            });
          }
        });
      }),
    ),
  });
}
