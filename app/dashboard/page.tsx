import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import prisma from "@/lib/db";
import { ExternalLink, Pen, Settings, Trash, Users2 } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuActiveSwitcher } from "@/components/EventTypeSwitcher";
import { CopyLinkMenuItem } from "@/components/CopyLinkMenuItem";
import { auth } from "@/auth";

// Inferred from the actual query (matches what `select` returns, not the
// full unselected row shape like `Prisma.EventTypeGetPayload<{}>`).
type EventTypeRow = NonNullable<Awaited<ReturnType<typeof getData>>>["EventType"][number];

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },

    select: {
      EventType: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      userName: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

const DashbaordPage = async () => {
  const session = await auth();
  if (!session?.user) {
    return notFound();
  }
  const data = await getData(session.user?.id as string);
  console.log("🚀 ~ DashbaordPage ~ data:", data);

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="sm:grid gap-1 hidden">
          <h1 className="font-heading text-3xl md:text-4xl">Event Types</h1>
          <p className="text-lg text-muted-foreground">
            Create and manage your event types.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new">Create New Event</Link>
        </Button>
      </div>
      {data.EventType.length === 0 ? (
        <EmptyState
          title="You have no Event Types"
          description="You can create your first event type by clicking the button below."
          buttonText="Add Event Type"
          href="/dashboard/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.EventType.map((eventType: EventTypeRow) => {
            const { id, active, duration, title, url } = eventType;
            return (
            <div
              className="  overflow-hidden shadow rounded-lg border relative"
              key={id}
            >
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-20" align="end">
                    <DropdownMenuLabel>Event</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href={`/${data.userName}/${url}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Preview</span>
                        </Link>
                      </DropdownMenuItem>
                      <CopyLinkMenuItem
                        meetingUrl={`${process.env.NEXT_PUBLIC_URL}/${data.userName}/${url}`}
                      />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/event/${id}`}>
                          <Pen className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/event/${id}/delete`}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link href={`/dashboard/event/${id}`}>
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users2 className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium truncate ">
                          {duration} Minutes Meeting
                        </dt>
                        <dd>
                          <div className="text-lg font-medium ">{title}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="bg-muted dark:bg-gray-900 px-5 py-3 flex justify-between items-center">
                <MenuActiveSwitcher initialChecked={active} eventTypeId={id} />

                <Link href={`/dashboard/event/${id}`}>
                  <Button className="">Edit Event</Button>
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default DashbaordPage;
