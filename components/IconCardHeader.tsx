import type { LucideIcon } from "lucide-react";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * CardHeader banner-icon block used in the 3 dashboard form pages
 * (`app/dashboard/{new,availability,settings}/page.tsx`).
 *
 * Renders:
 *   <CardHeader text-center pb-2>
 *     <div mx-auto mb-4 size-12 rounded-xl bg-primary/10 flex center
 *          ring-1 ring-primary/20>
 *       <Icon size-6 text-primary />
 *     </div>
 *     <CardTitle text-2xl font-bold tracking-tight>{title}</CardTitle>
 *     <CardDescription>{description}</CardDescription>
 *   </CardHeader>
 *
 * Intentionally NOT used in `app/onboarding/grand-id/page.tsx` — that page's
 * banner is materially different (`size-16`, gradient, pinging decorative
 * dot, different title margins) and conflating them would leak props.
 */
interface IconCardHeaderProps {
  /** Lucide icon shown in the rounded-xl primary-tinted banner. */
  icon: LucideIcon;
  /** Card heading text. */
  title: string;
  /** Subtitle text rendered via `<CardDescription>`. */
  description: string;
}

export function IconCardHeader({
  icon: Icon,
  title,
  description,
}: IconCardHeaderProps) {
  return (
    <CardHeader className="text-center pb-2">
      <div className="mx-auto mb-4 size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
        <Icon className="size-6 text-primary" />
      </div>
      <CardTitle className="text-2xl font-bold tracking-tight">
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}
