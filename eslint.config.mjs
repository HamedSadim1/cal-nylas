import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

// Top-level file exclusion. The `recommended` and `core-web-vitals`
// configs we extend DO ignore `node_modules/**` globally, but they
// don't skip `.next/**` — which causes ESLint to flood the report
// with thousands of errors from compiled Turbopack output chunks
// (`next build --turbopack` writes `require()`-style imports and
// vendored `__Unused` placeholders into `.next/build/*.js`). CI
// clones without a `.next/` so it's a non-issue there, but locally
// any prior `next build` pollutes the lint output and makes CI vs
// local results diverge in confusing ways.
//
// `node_modules/**` is duplicated intentionally: ESLint flat-config
// `ignores` entries union across configs, so adding it explicitly is
// just structural insurance against an upstream default change.
export default tseslint.config(
  {
    ignores: [".next/**", "node_modules/**"],
  },
  ...tseslint.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
);
