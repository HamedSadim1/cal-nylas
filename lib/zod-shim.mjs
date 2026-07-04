// Self-contained stub for the bare `'zod'` and `'zod/v3'` specifiers, used
// ONLY by Next.js / Webpack / Turbopack for static module analysis.
//
// Why this file exists:
//   - The user's app code only imports from `@conform-to/zod/v4` and uses
//     `import { z } from "zod/v4"`. The legacy `@conform-to/zod`
//     `dist/(default|v3)/*.mjs` are dead code at runtime in our app.
//   - But Next.js's bundler statically walks those dist files
//     transitively (via the package's `exports` map and the
//     server-bundle pre-pass).
//   - Real zod 4.x REMOVED `ZodPipeline`, `ZodEffects`, `ZodBranded`,
//     etc. — those names are referenced as ESM imports inside
//     coercion.mjs even though they're never instantiated in our app.
//   - zod's own migration guide recommends: "aliasing or patching the
//     import to zod/v3 until the dependency is updated".
//
// IMPORTANT design notes:
//   - Stubs here are intentionally empty / inert. They only need to
//     exist as ESM bindings to satisfy the bundler's symbol-resolution
//     step. Our app never instantiates any of them at runtime.
//   - NO `export * from "..."` wildcards on purpose. Wildcards merge
//     into the export table and interact unpredictably with explicit
//     class declarations under Vercel's bundler (we empirically saw
//     the missing-symbol name flip between deploys as a result: the
//     bundler walked more of the table each run). Pure static export
//     tables are deterministic and have no merge logic.
//
// Symbols referenced by `@conform-to/zod@1.19.4`'s legacy
// `dist/(default|v3)/coercion.mjs` as `from 'zod'` / `from 'zod/v3'`:
//   any, lazy,
//   ZodArray, ZodObject, ZodEffects, ZodOptional, ZodDefault,
//   ZodCatch, ZodIntersection, ZodUnion, ZodDiscriminatedUnion,
//   ZodBranded, ZodTuple, ZodNullable, ZodPipeline

// ──────────────────────────────────────────────────────────────────
// Proxy-based chainable for factory calls like `any().pipe(target)`
// in the dead-code path. Returns an opaque shape so arbitrary
// chained calls evaluate without throwing. They're never executed at
// runtime in our app.
// ──────────────────────────────────────────────────────────────────
const chainable = () => {
  const obj = {};
  return new Proxy(obj, {
    get(target, prop) {
      if (prop === "then") return undefined; // not a Promise
      return target[prop] ?? chainable;
    },
  });
};

export const any = () => chainable();
export const lazy = () => chainable();

// ──────────────────────────────────────────────────────────────────
// v3-shaped class stubs (the names zod 4 removed from its public API).
// Empty — they're never `new`'d in our app.
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
export class ZodFirstPartyTypeKind {}
export class ZodError extends Error {}

// `ZodIssueCode` enum-like — `zod-validation-error/v3/index.mjs`
// does `import * as zod from "zod/v3"; zod.ZodIssueCode.invalid_union`.
// Stubbed as a Proxy so the namespaced property access evaluates
// without throwing in dead code paths.
export const ZodIssueCode = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === "then") return undefined;
      return chainable;
    },
  },
);

// ──────────────────────────────────────────────────────────────────
// `z` namespace object — mirrors the real zod factory surface so
// `import * as z from "zod/v3"; z.string(); z.object(); …` in
// transitive dead code (e.g. `zod-validation-error/v3/index.mjs`)
// evaluates without throwing.
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
