"use client";

import { cn } from "@/lib/utils";
import { CalendarCheck, HomeIcon, Settings, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ROUTES } from "@/lib/constants";

export const dashboardLinks = [
  {
    id: 0,
    name: "Event Types",
    href: ROUTES.DASHBOARD,
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Meetings",
    href: ROUTES.DASHBOARD_MEETINGS,
    icon: Users2,
  },
  {
    id: 2,
    name: "Availability",
    href: ROUTES.DASHBOARD_AVAILABILITY,
    icon: CalendarCheck,
  },
  {
    id: 3,
    name: "Settings",
    href: ROUTES.DASHBOARD_SETTINGS,
    icon: Settings,
  },
];

export function DasboardLinks() {
  const pathname = usePathname();
  return (
    <>
      {dashboardLinks.map((link) => {
        const isActive =
          link.href === ROUTES.DASHBOARD
            ? pathname === ROUTES.DASHBOARD
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.id}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <link.icon
              className={cn(
                "size-4 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            />
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
