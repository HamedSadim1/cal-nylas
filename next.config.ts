import path from "node:path";
import type { NextConfig } from "next";

// Project-root-prefixed absolute paths, used by both the webpack and
// Turbopack alias blocks below. Turbopack's `resolveAlias` requires
// values that resolve to a concrete file; webpack's `$`-anchored
// aliases accept either specifiers or paths. Prefixing with
// `process.cwd()` keeps the resolution explicit and avoids surprises
// if `next.config.ts` is ever evaluated outside the project root.
const ZOD_V3_SHIM = path.join(process.cwd(), "lib", "zod-shim.mjs");
// `dist/v4/index.mjs` and `dist/v4/future.mjs` ship in
// `@conform-to/zod@1.19.4` and are the ONLY paths the app actually
// imports from. We point the legacy `@conform-to/zod*` specifiers at
// these concrete files so Turbopack never enters `dist/default/` or
// `dist/v3/` (whose `coercion.mjs` references legacy v3-only zod
// symbols that real zod 4.x removed).
const CONFORM_V4_INDEX = path.join(
  process.cwd(),
  "node_modules",
  "@conform-to",
  "zod",
  "dist",
  "v4",
  "index.mjs",
);
const CONFORM_V4_FUTURE = path.join(
  process.cwd(),
  "node_modules",
  "@conform-to",
  "zod",
  "dist",
  "v4",
  "future.mjs",
);

const nextConfig: NextConfig = {
  /* config options here */
  // Webpack alias for LOCAL builds (`next dev` / local `next build`).
  // Vercel uses Turbopack for `next build` — that path uses the
  // `turbopack.resolveAlias` block below. Both blocks share the same
  // intent (redirect the legacy `@conform-to/zod*` specifiers to the
  // safe `/v4` subpath and redirect bare `'zod'` / `'zod/v3'` to
  // `lib/zod-shim.mjs`) but use the syntax each bundler expects.
  // The `$` suffix forces exact match so legitimate specifiers
  // (`@conform-to/zod/v4`, `zod/v4`, `zod-validation-error`) are not
  // affected.
  webpack: (config, { isServer }) => {
    // Skip the alias on client builds — the client's app code only
    // touches `@conform-to/zod/v4` (whose own `'zod/v4'` import
    // resolves normally), so there's no dead-coercion.mjs fallthrough
    // on the client. Skipping also avoids any chance of the alias
    // shape regressing in a future Next.js client-build pass.
    if (!isServer) return config;
    // `Object.assign` over `...config.resolve.alias` so we don't drop
    // entries if Next/Webpack ever switches the alias shape to an
    // array form.
    Object.assign((config.resolve.alias ??= {}), {
      "@conform-to/zod$": "@conform-to/zod/v4",
      "@conform-to/zod/v3$": "@conform-to/zod/v4",
      "@conform-to/zod/v3/future$": "@conform-to/zod/v4/future",
      // Belt-and-suspenders shim: redirect the bare `'zod'` (top-level)
      // and `'zod/v3'` specifiers to `lib/zod-shim.mjs`. Real zod 4.x
      // renamed/removed the legacy class names that
      // `@conform-to/zod/dist/(default|v3)/coercion.mjs` references if
      // either is ever reached transitively.
      zod$: ZOD_V3_SHIM,
      "zod/v3$": ZOD_V3_SHIM,
    });
    return config;
  },
  // CRITICAL: do NOT add `@conform-to/zod` to `serverExternalPackages`.
  // That option tells Next.js to Node-File-Trace the package's
  // `exports` map (every subpath including `dist/default/index.mjs`),
  // which then statically walks `dist/default/coercion.mjs` and
  // fails the build because real zod 4.x removed the v3-only class
  // names it imports (`ZodBranded`, `ZodEffects`, `ZodPipeline`). The
  // build needs to be lazy: it should only bundle what the app
  // actually imports (`@conform-to/zod/v4`), not every subpath the
  // package exposes. Leaving `serverExternalPackages` empty (or
  // omitting the key entirely) keeps the build lazy.
  // Forward-compat block for `next build --turbopack` (Vercel runs
  // Turbopack for `next build` by default in Next.js 16+).
  //
  // Two requirements per the Next.js docs:
  //  1. Values are absolute file paths, NOT other specifiers. Turbopack
  //     does not recursively re-resolve alias values, so a value like
  //     `@conform-to/zod/v4` causes a module-not-found error instead of
  //     resolving to the package's `exports` entry. We instead point at
  //     the concrete `dist/v4/index.mjs` / `dist/v4/future.mjs` files.
  //  2. Aliases are prefix-segment matched. We DO NOT alias `'zod/v4'`
  //     / `'zod/v4-mini'` etc. — the app's own `import { z } from
  //     "zod/v4"` and the v4 subpath resolvers need to flow through
  //     normal node resolution. We only redirect the legacy `'zod'`
  //     and `'zod/v3'` specifiers and the legacy bare `@conform-to/zod`
  //     specifiers.
  turbopack: {
    resolveAlias: {
      "@conform-to/zod": CONFORM_V4_INDEX,
      "@conform-to/zod/v3": CONFORM_V4_INDEX,
      "@conform-to/zod/v3/future": CONFORM_V4_FUTURE,
      "zod/v3": ZOD_V3_SHIM,
      zod: ZOD_V3_SHIM,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
