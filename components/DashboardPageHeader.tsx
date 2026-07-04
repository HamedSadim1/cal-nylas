import * as React from "react";

/**
 * Standard dashboard-section header. Left column renders the page `<h1>`
 * with an explanatory description; right column hosts an optional `cta`
 * slot for a primary action button.
 *
 * Mirrors the layout previously inlined at the top of
 * `app/dashboard/page.tsx`. Designed to be reused by any future CRUD-list
 * dashboard section (Meetings, Availability, etc.) so the layout/
 * typography/spacing live in one place.
 *
 * Caller-injected `cta` keeps the header icon-agnostic — pass any
 * `<Button asChild>…</Button>` (or none) without coupling this component
 * to specific lucide icons or route constants.
 */
interface DashboardPageHeaderProps {
  /** Main h1 title (e.g. "Event Types"). */
  title: string;
  /** Explanatory subtitle shown below the title (muted-foreground). */
  description: string;
  /**
   * Optional CTA slot rendered in the right column on `sm:flex-row`.
   * Typically a `<Button asChild>` wrapping a `<Link>` + lucide icon.
   */
  cta?: React.ReactNode;
}

export function DashboardPageHeader({
  title,
  description,
  cta,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      {cta ? <div className="shrink-0">{cta}</div> : null}
    </div>
  );
}
