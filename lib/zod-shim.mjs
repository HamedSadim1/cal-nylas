// Self-contained stub for the bare `'zod'` and `'zod/v3'` specifiers, used
// ONLY by Next.js / Webpack / Turbopack for static module analysis.
//
// Why this file exists:
//   - The user's app code only imports from `@conform-to/zod/v4` and uses
//     `import { z } from "zod/v4"`. The legacy `@conform-to/zod`
//     `dist/(default|v3)/coercion.mjs` etc. are dead code at runtime.
//   - But Next.js's bundler statically walks those dist files
//     transitively (via the package's `exports` map and Next's
//     server-bundle pre-pass).
//   - Real zod 4.x REMOVED `ZodPipeline`, `ZodEffects`, etc. — those
//     names are referenced as ESM imports inside coercion.mjs even
//     though they'd never be instantiated in our app.
//   - zod's own migration guide recommends: "aliasing or patching the
//     import to zod/v3 until the dependency is updated".
//
// IMPORTANT design notes:
//   - Stubs here are intentionally empty / inert. They only need to
//     exist as ESM bindings to satisfy the bundler's symbol-resolution
//     step. Our app never instantiates any of them at runtime.
//   - We re-export `zod/v4` (real) so any transitive that uses
//     v4-shaped class names (`_zod`, `_def`, `parse`, `safeParse`,
//     `$Zod*`, etc.) — accessed as `import * as z from "zod/v3"` or
//     similar in dead-code paths in `zod-validation-error`, etc. —
//     still resolves. The explicit v3 class stubs BELOW then override
//     any v3-shaped bindings that v4 removed or renamed.
//   - We export a `z` namespace object mirroring the real zod factory
//     surface, so transitive code that does `import * as zod from
//     "zod/v3"; zod.string(); zod.object();` evaluates without error.
//
// Symbols referenced by `@conform-to/zod@1.19.4`'s legacy
// `dist/(default|v3)/coercion.mjs` from `from 'zod'` and `from 'zod/v3'`:
//   any, lazy,
//   ZodArray, ZodObject, ZodEffects, ZodOptional, ZodDefault,
//   ZodCatch, ZodIntersection, ZodUnion, ZodDiscriminatedUnion,
//   ZodBranded, ZodTuple, ZodNullable, ZodPipeline
// Plus common v3 names that any redeclaring transitive might import:
//   ZodError, ZodType, ZodTypeAny, ZodString, ZodNumber, ZodBoolean,
//   ZodDate, ZodBigInt, ZodEnum, ZodLiteral, ZodNativeEnum, ZodLazy,
//   ZodFirstPartyTypeKind
// Plus factory functions the dist code uses as call sites:
//   string, number, boolean, date, bigint, object, array, tuple,
//   union, literal, enum, nativeEnum, record, map, set, function,
//   optional, nullable, null, undefined, void, any, unknown, never,
//   transform, preprocess, refine, superRefine, pipe, lazy

// Re-export everything from real `zod/v4` so v4-shaped symbols
// (`_zod`, `_def`, `parse`, `safeParse`, `$Zod*`, etc.) are present.
// Explicit v3 stubs below override any v3-shaped names that v4
// removed or renamed (`ZodPipeline`, `ZodEffects`, …).
export * from "zod/v4";

// ──────────────────────────────────────────────────────────────────
// Factory-function stubs (called as e.g. `any().pipe(target)` in the
// dead code path — return an opaque shape so any call-chain `.transform`
// / `.pipe` / `.optional` reads/writes to plain fields).
// ──────────────────────────────────────────────────────────────────
const chainable = () => {
  const obj = {};
  return new Proxy(obj, {
    get(target, prop) {
      if (prop === "then") return undefined; // not a Promise
      // Return `chainable` for any method/property access so chained
      // calls like `.transform(x).pipe(target)` evaluate without error.
      return target[prop] ?? chainable;
    },
  });
};

export const any = () => chainable();
export const lazy = (fn) => chainable();
export const string = () => chainable();
export const number = () => chainable();
export const boolean = () => chainable();
export const date = () => chainable();
export const bigint = () => chainable();
export const object = () => chainable();
export const array = () => chainable();
export const tuple = () => chainable();
export const union = () => chainable();
export const literal = () => chainable();
export const enum$ = () => chainable();
export const nativeEnum = () => chainable();
export const record = () => chainable();
export const map = () => chainable();
export const set = () => chainable();
export const function$ = () => chainable();
export const optional = () => chainable();
export const nullable = () => chainable();
export const null$ = () => chainable();
export const undefined$ = () => chainable();
export const void$ = () => chainable();
export const unknown = () => chainable();
export const never = () => chainable();
export const transform = () => chainable();
export const preprocess = () => chainable();
export const refine = () => chainable();
export const superRefine = () => chainable();
export const pipe = () => chainable();

// ──────────────────────────────────────────────────────────────────
// v3-shaped class stubs. Empty — they're never `new`'d in our app.
// ──────────────────────────────────────────────────────────────────
export class ZodArray {}
export class ZodObject {}
export class ZodEffects {}
export class ZodOptional {}
export class ZodDefault {}
export class ZodCatch {}
export class ZodIntersection {}
export class ZodUnion {}
export class ZodDiscriminatedUnion {}
export class ZodBranded {}
export class ZodTuple {}
export class ZodNullable {}
export class ZodPipeline {}
export class ZodString {}
export class ZodNumber {}
export class ZodBoolean {}
export class ZodDate {}
export class ZodBigInt {}
export class ZodEnum {}
export class ZodLiteral {}
export class ZodNativeEnum {}
export class ZodLazy {}
export class ZodType {}
export class ZodTypeAny {}
export class ZodError extends Error {}
export const ZodFirstPartyTypeKind = {};

// ──────────────────────────────────────────────────────────────────
// `z` namespace object — mirrors the real zod factory surface so
// `import * as z from "zod/v3"; z.string(); z.object(); …` evaluates
// without throwing in transitive dead code.
// ──────────────────────────────────────────────────────────────────
export const z = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === "then") return undefined; // not a Promise
      return chainable;
    },
  },
);
