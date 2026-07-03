import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck2,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  Users,
  Video,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";

const features = [
  {
    icon: CheckCircle2,
    text: "Auto-sync availability",
  },
  {
    icon: Users,
    text: "Prevent double bookings",
  },
  {
    icon: Globe,
    text: "Auto timezone conversion",
  },
  {
    icon: Video,
    text: "Google Meet integration",
  },
];

const GrantIdRoute = () => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-50 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 -z-10 h-50 w-50 rounded-full bg-blue-500/10 opacity-40 blur-[80px]" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src={Logo}
                className="relative size-8 transition-transform duration-300 group-hover:scale-110"
                alt="Logo"
              />
            </div>
            <h4 className="text-xl font-bold tracking-tight">
              Cal<span className="text-primary">Hamed</span>
            </h4>
          </Link>
          <Link
            href="/onboarding"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg">
          {/* Progress indicator */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center size-9 rounded-full bg-primary/20 text-primary text-sm font-bold ring-2 ring-primary/20">
                <CheckCircle2 className="size-4" />
              </span>
              <div className="h-0.5 flex-1 bg-primary/40 rounded-full" />
              <span className="flex items-center justify-center size-9 rounded-full bg-primary text-primary-foreground text-sm font-bold ring-2 ring-primary/30 shadow-lg shadow-primary/25">
                2
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Step 2 of 2 — Connect your calendar
            </p>
          </div>

          {/* Card */}
          <Card className="animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100 [animation-fill-mode:both] border-border/60 shadow-xl relative overflow-hidden">
            {/* Decorative gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

            <CardHeader className="text-center pb-2 pt-8">
              {/* Animated success badge */}
              <div className="mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-25 [animation-duration:2s]" />
                <div className="relative size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/30 shadow-lg shadow-primary/10">
                  <Sparkles className="size-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                You&apos;re almost done!
              </CardTitle>
              <CardDescription className="text-base max-w-sm mx-auto">
                Connect your calendar to unlock automated scheduling and focus
                on what matters most
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6 items-center pb-8">
              {/* Calendar visual mockup */}
              <div className="w-full rounded-xl border border-border bg-muted/30 p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-primary" />
                    <span className="text-sm font-medium">Your Calendar</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    After connecting
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { day: "Mon", slots: 3 },
                    { day: "Tue", slots: 4 },
                    { day: "Wed", slots: 2 },
                    { day: "Thu", slots: 5 },
                  ].map((item) => (
                    <div
                      key={item.day}
                      className="text-center p-2 rounded-lg bg-background border border-border/60"
                    >
                      <span className="text-[10px] text-muted-foreground block mb-1">
                        {item.day}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {Array.from({ length: item.slots }).map((_, i) => (
                          <div
                            key={i}
                            className="h-1.5 rounded-full bg-primary/30"
                            style={{ opacity: 1 - i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  <Clock className="size-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    Availability auto-synced
                  </span>
                </div>
              </div>

              {/* Feature hints with staggered animation */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-300 [animation-fill-mode:both]`}
                    style={{ animationDelay: `${300 + i * 100}ms` }}
                  >
                    <feature.icon className="size-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-xs text-muted-foreground leading-tight">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA with pulsing glow */}
              <div className="relative w-full group/cta-btn">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary via-primary/50 to-primary opacity-0 group-hover/cta-btn:opacity-100 blur transition-opacity duration-500" />
                <div className="absolute -inset-0.5 rounded-lg bg-primary/30 animate-pulse opacity-40 group-hover/cta-btn:opacity-0 [animation-duration:2.5s]" />
                <Button
                  asChild
                  size="lg"
                  className="relative w-full gap-2.5 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                >
                  <Link href="/api/auth">
                    <CalendarCheck2 className="size-5" />
                    Connect your calendar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border text-center text-muted-foreground">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} CalHamed. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default GrantIdRoute;
