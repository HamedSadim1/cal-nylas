import Link from "next/link";
import { Menu, LogOut, Settings, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { DasboardLinks } from "@/components/DasboardLinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { signOut } from "@/auth";
import prisma from "@/lib/db";
import { ROUTES, APP_BRAND_SHORT } from "@/lib/constants";
import { requireUser } from "@/lib/auth";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      userName: true,
      grantId: true,
    },
  });
  return data;
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireUser({ redirectTo: ROUTES.HOME });
  const data = await getData(session.user.id);
  if (!data?.userName) return redirect(ROUTES.ONBOARDING);
  if (!data.grantId) return redirect(ROUTES.ONBOARDING_GRANT_ID);

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sidebar — glassmorphism */}
        <aside className="hidden md:flex flex-col border-r border-border/50 bg-background/70 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex h-14 items-center gap-3 px-6 border-b border-border/50 lg:h-15">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={Logo}
                  alt="Logo"
                  className="relative size-7 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Cal<span className="text-primary">{APP_BRAND_SHORT}</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <DasboardLinks />
          </nav>

          {/* User info at bottom */}
          <div className="border-t border-border/50 px-4 py-3">
            <div className="flex items-center gap-3">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="size-8 rounded-full ring-2 ring-border"
                />
              ) : (
                <div className="size-8 rounded-full bg-primary/10 ring-2 ring-border flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {(session.user.name || data.userName || "?").charAt(0)}
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {session.user.name || data.userName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex flex-col">
          {/* Header — glassmorphism */}
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:h-15 lg:px-6">
            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-70 p-0">
                <SheetHeader className="p-6 pb-2">
                  <SheetTitle className="flex items-center gap-2.5">
                    <Image src={Logo} alt="Logo" className="size-8" />
                    <span className="text-xl font-bold">
                      Cal<span className="text-primary">{APP_BRAND_SHORT}</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="px-3 py-4">
                  <DasboardLinks />
                </nav>
                <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 px-6 py-4">
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>

            {/* Right side of header */}
            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 hover:bg-accent rounded-lg px-2 py-1.5 transition-colors">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={28}
                        height={28}
                        className="size-7 rounded-full ring-1 ring-border"
                      />
                    ) : (
                      <div className="size-7 rounded-full bg-primary/10 ring-1 ring-border flex items-center justify-center">
                        <span className="text-[10px] font-medium text-primary">
                          {(session.user.name || data.userName || "?").charAt(
                            0,
                          )}
                        </span>
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium max-w-25 truncate">
                      {session.user.name || data.userName}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={ROUTES.DASHBOARD_SETTINGS}
                      className="flex items-center gap-2"
                    >
                      <Settings className="size-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form
                      className="w-full"
                      action={async () => {
                        "use server";
                        await signOut();
                      }}
                    >
                      <button className="flex items-center gap-2 w-full text-left">
                        <LogOut className="size-4" />
                        Log out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
      <Toaster richColors closeButton />
    </>
  );
}
