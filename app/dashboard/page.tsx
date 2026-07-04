import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import prisma from "@/lib/db";
import {
  ExternalLink,
  MoreHorizontal,
  Pen,
  Plus,
  Trash2,
  Users2,
  Clock,
} from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { ROUTES } from "@/lib/constants";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuActiveSwitcher } from "@/components/EventTypeSwitcher";
import { CopyLinkMenuItem } from "@/components/CopyLinkMenuItem";
import { requireUser } from "@/lib/auth";
import { buildBookingUrl } from "@/lib/urls";

type EventTypeRow = NonNullable<
  Awaited<ReturnType<typeof getData>>
>["EventType"][number];

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: { id },
    select: {
      EventType: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
        orderBy: { createdAt: "desc" },
      },
      userName: true,
    },
  });

  if (!data) return notFound();
  return data;
}

const DashboardPage = async () => {
  const session = await requireUser({ redirectTo: ROUTES.HOME });
  const data = await getData(session.user.id);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Event Types
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your event types for scheduling
          </p>
        </div>
        <Button asChild size="lg" className="gap-2 shrink-0">
          <Link href={ROUTES.DASHBOARD_NEW}>
            <Plus className="size-5" />
            Create New Event
          </Link>
        </Button>
      </div>

      {/* Content */}
      {data.EventType.length === 0 ? (
        <EmptyState
          title="No event types yet"
          description="Create your first event type to start sharing your availability and let people book time with you."
          buttonText="Create Event Type"
          href={ROUTES.DASHBOARD_NEW}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.EventType.map((eventType: EventTypeRow) => {
            const { id, active, duration, title, url } = eventType;

            return (
              <div
                key={id}
                className="group relative rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden"
              >
                {/* Card top area */}
                <Link
                  href={`${ROUTES.DASHBOARD_EVENT}/${id}`}
                  className="block p-5"
                >
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

                    {/* Dropdown menu */}
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
                            <Link href={`/${data.userName}/${url}`}>
                              <ExternalLink className="mr-2 size-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <CopyLinkMenuItem
                            meetingUrl={buildBookingUrl(data.userName, url)}
                          />
                          <DropdownMenuItem asChild>
                            <Link href={`${ROUTES.DASHBOARD_EVENT}/${id}`}>
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
                          <Link href={`${ROUTES.DASHBOARD_EVENT}/${id}/delete`}>
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Link>

                {/* Card footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <MenuActiveSwitcher
                      initialChecked={active}
                      eventTypeId={id}
                    />
                    <span className="text-xs text-muted-foreground">
                      {active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`${ROUTES.DASHBOARD_EVENT}/${id}`}>
                      <Pen className="size-3.5 mr-1.5" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default DashboardPage;
