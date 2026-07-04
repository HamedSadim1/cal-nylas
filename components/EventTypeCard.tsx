"use client";

import Link from "next/link";
import {
  Clock,
  ExternalLink,
  MoreHorizontal,
  Pen,
  Trash2,
  Users2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyLinkMenuItem } from "@/components/CopyLinkMenuItem";
import { MenuActiveSwitcher } from "@/components/EventTypeSwitcher";
import { buildBookingUrl, buildEventTypeUrl } from "@/lib/urls";

/**
 * One event-type card on the dashboard's "Event Types" grid.
 *
 * Composes:
 *   - Top area wrapped in a `<Link href={buildEventTypeUrl(id)}>` (clicking
 *     the card opens edit) carrying the Users2 banner chip + `<h3>` title
 *     (truncated) + duration row (Clock + "{n} min").
 *   - A kebab `<DropdownMenu>` with Preview / Copy Link / Edit / Delete.
 *     The trigger's `onClick={(e) => e.preventDefault()}` is REQUIRED —
 *     without it the trigger bubbles up and the parent Link fires,
 *     accidentally opening Edit on every kebab click.
 *   - Card footer with the `MenuActiveSwitcher` + "Active"/"Inactive" pill
 *     on the left, and a small Edit button on the right.
 *
 * `"use client"` because of the trigger's preventDefault + the two client
 * sub-components (`MenuActiveSwitcher`, `CopyLinkMenuItem`). The page
 * itself (`app/dashboard/page.tsx`) remains a server component that
 * projects Prisma data and maps it to a list of these cards.
 */
interface EventTypeCardProps {
  /** Projected EventType record from `app/dashboard/page.tsx:getData`. */
  eventType: {
    id: string;
    active: boolean;
    title: string;
    url: string;
    duration: number;
  };
  /** Owner's `userName` — needed for the Copy-Link preview URL. */
  userName: string;
}

export function EventTypeCard({ eventType, userName }: EventTypeCardProps) {
  const { id, active, duration, title, url } = eventType;

  return (
    <div className="group relative rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden">
      {/* Card top area — clicking anywhere navigates to edit. */}
      <Link href={buildEventTypeUrl(id)} className="block p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 group-hover:bg-primary/15 transition-colors">
              <Users2 className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-lg leading-tight truncate">
                {title}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                <Clock className="size-3.5" />
                <span>{duration} min</span>
              </div>
            </div>
          </div>

          {/* Kebab dropdown — keep the trigger's preventDefault so the
             parent <Link> doesn't fire when the user opens the menu. */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={`/${userName}/${url}`}>
                    <ExternalLink className="mr-2 size-4" />
                    Preview
                  </Link>
                </DropdownMenuItem>
                <CopyLinkMenuItem meetingUrl={buildBookingUrl(userName, url)} />
                <DropdownMenuItem asChild>
                  <Link href={buildEventTypeUrl(id)}>
                    <Pen className="mr-2 size-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className="text-destructive focus:text-destructive"
              >
                <Link href={buildEventTypeUrl(id, "delete")}>
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>

      {/* Card footer — active switch + Edit button. */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <MenuActiveSwitcher initialChecked={active} eventTypeId={id} />
          <span className="text-xs text-muted-foreground">
            {active ? "Active" : "Inactive"}
          </span>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildEventTypeUrl(id)}>
            <Pen className="size-3.5 mr-1.5" />
            Edit
          </Link>
        </Button>
      </div>
    </div>
  );
}
