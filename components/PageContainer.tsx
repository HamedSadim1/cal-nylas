import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Dashboard form-page layout shell with the canonical entrance animation
 * (fade-in + slide-in-from-bottom-4 over 500ms).
 *
 * Replaces the duplicated
 * `<div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">`
 * wrapper that previously lived inline in
 * `app/dashboard/{new,availability,settings}/page.tsx`. Accepts a className
 * extension point (merged via `cn`) so a page can override `max-w-*`, drop
 * the animation, or add padding without forking the SSOT.
 *
 * Use inside the root layout's `<main>` slot — children fall through to the
 * dashboard sidebar / navbar.
 */
export function PageContainer({
  children,
  className,
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
