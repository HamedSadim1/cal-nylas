import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import React from "react";
import { Prisma } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/DashboardPageHeader";
import { EmptyState } from "@/components/EmptyState";
import { EventTypeCard } from "@/components/EventTypeCard";
import { requireUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import prisma from "@/lib/db";

// SSOT for the dashboard event-type projection. With Prisma's `select`
// inlining the chosen fields through `Awaited<ReturnType<…>>` is
// sometimes brittle (the chained `.EventType.map(…)` callback in
// particular loses the inner shape under Next.js 16 + Turbopack's
// stricter contextual-typing). The `Prisma.EventTypeGetPayload<…>`
// helper re-derives the exact row type from the schema + select, so
// the explicit annotation below is robust regardless of how the
// surrounding promise return type is inferred.
type DashboardEventType = Prisma.EventTypeGetPayload<{
  select: {
    id: true;
    active: true;
    title: true;
    url: true;
    duration: true;
  };
}>;

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
        // Hard safety limit: card-grids that scale into the hundreds of
        // rows flood Node's heap AND the user's viewport. Paginates
        // sooner or later, but `take: 100` is the floor that keeps a
        // single misbehaving account from taking down the dashboard.
        take: 100,
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

  // Hoist userName to narrow Prisma's `string | null` projection into a
  // plain `string` for the rest of the page. The dashboard layout already
  // redirects users without a `userName` away to onboarding, but TS can't
  // see that — the early-return turns the rest of the page into a
  // single-source-of-truth for the non-null assertion.
  const { userName, EventType } = data;
  if (!userName) return notFound();

  return (
    <>
      <DashboardPageHeader
        title="Event Types"
        description="Create and manage your event types for scheduling"
        cta={
          <Button asChild size="lg" className="gap-2 shrink-0">
            <Link href={ROUTES.DASHBOARD_NEW}>
              <Plus className="size-5" />
              Create New Event
            </Link>
          </Button>
        }
      />

      {EventType.length === 0 ? (
        <EmptyState
          title="No event types yet"
          description="Create your first event type to start sharing your availability and let people book time with you."
          buttonText="Create Event Type"
          href={ROUTES.DASHBOARD_NEW}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EventType.map((eventType: DashboardEventType) => (
            <EventTypeCard
              key={eventType.id}
              eventType={eventType}
              userName={userName}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default DashboardPage;
