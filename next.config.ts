import path from "node:path";
import type { NextConfig } from "next";

// Use `join(process.cwd(), …)` rather than `path.resolve("…")` so the
// resolution is explicit about its base (project root at `next build`
// time) — avoids silent breakage if `next.config.ts` is ever evaluated
// from a different CWD (e.g. workspace tooling).
const ZOD_V3_SHIM = path.join(process.cwd(), "lib", "zod-shim.mjs");

const nextConfig: NextConfig = {
  /* config options here */
  // Defensive: redirect any leftover default/v3/v3·future `conform/zod` import
  // to the v4 subpath at the bundler level. The `/v3` dist re-exports
  // `ZodPipeline` (and other v3-only symbols) from `zod/v3`, which zod v4.x
  // no longer exposes — so even a single transitive default or `/v3` import
  // stalls the `next build` server bundle compilation. The `$` suffix forces
  // exact match so `@conform-to/zod/v4` resolves to itself (no circular alias).
  webpack: (config) => {
    // `Object.assign` over `...config.resolve.alias` so we don't drop entries
    // if Next/Webpack ever switches the alias shape to an array form.
    Object.assign((config.resolve.alias ??= {}), {
      "@conform-to/zod$": "@conform-to/zod/v4",
      "@conform-to/zod/v3$": "@conform-to/zod/v4",
      "@conform-to/zod/v3/future$": "@conform-to/zod/v4/future",
      // Belt-and-suspenders shim: redirect the bare `'zod'` (top-level)
      // and `'zod/v3'` specifiers to `lib/zod-shim.mjs`. Real zod 4.x
      // renamed/removed the legacy class names that
      // `@conform-to/zod/dist/(default|v3)/coercion.mjs` references; our
      // shim re-exports `zod/v4` and stubs the missing classes for
      // bundler-time static analysis only.
      // `$` is exact match — we DO NOT alias `'zod/v4'` (so the app's
      // own `import { z } from "zod/v4"` still resolves normally).
      zod$: ZOD_V3_SHIM,
      "zod/v3$": ZOD_V3_SHIM,
    });
    return config;
  },
  // Forward-compat analog for `next build --turbopack` (and any future
  // Turbopack work). Turbopack aliases are prefix-matched (no `$` regex),
  // so each key handles nested subpaths automatically — `zod` covers both
  // the bare specifier and any future `zod/*` subpath. The shim at
  // `lib/zod-shim.mjs` is fully self-contained (no `export *`) so the
  // bundler's wildcard expansion can't degrade it.
  turbopack: {
    resolveAlias: {
      "@conform-to/zod": "@conform-to/zod/v4",
      "@conform-to/zod/v3": "@conform-to/zod/v4",
      zod: ZOD_V3_SHIM,
      "zod/v3": ZOD_V3_SHIM,
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
