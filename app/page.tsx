import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { redirect } from "next/navigation";
import { AuthModal } from "@/components/AuthModal";
import { Calendar, Clock, LinkIcon, Users, Zap, Shield } from "lucide-react";

const features = [
  {
    title: "Seamless Scheduling",
    description:
      "Share your personalized link and let clients book time slots that work for you.",
    icon: LinkIcon,
  },
  {
    title: "Calendar Sync",
    description:
      "Automatically syncs with your calendars to prevent double bookings.",
    icon: Calendar,
  },
  {
    title: "Time Zones Sorted",
    description:
      "We automatically detect and convert time zones for your invitees globally.",
    icon: Clock,
  },
  {
    title: "Group Events",
    description:
      "Host webinars, workshops, or group consultations effortlessly.",
    icon: Users,
  },
  {
    title: "Fast & Reliable",
    description:
      "Built on modern web technologies for a lightning-fast native experience.",
    icon: Zap,
  },
  {
    title: "Secure by Design",
    description:
      "Your data is safe and strictly protected with industry-standard security.",
    icon: Shield,
  },
];

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        {/* Glowing blur orb */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-50 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 flex flex-col justify-center">
          {/* Hero Section */}
          <section className="py-20 md:py-32 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                Welcome to CalHamed
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
                Scheduling made{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400">
                  ridiculously
                </span>{" "}
                simple
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Eliminate the back-and-forth emails. CalHamed helps you focus on
                what matters most with automated scheduling and seamless
                calendar sync.
              </p>
              <div className="flex justify-center gap-4">
                <AuthModal />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="py-20 scroll-mt-24 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 [animation-fill-mode:both]"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Everything you need to manage your time
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform provides all the tools required to schedule
                meetings smoothly and professionally.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group p-6 border border-border rounded-2xl bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section
            id="cta"
            className="py-20 md:py-32 scroll-mt-24 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 [animation-fill-mode:both]"
          >
            <div className="bg-primary/5 rounded-3xl p-8 md:p-16 text-center border border-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
                  Ready to simplify your scheduling?
                </h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Join professionals who trust CalHamed to manage their time
                  effectively. Get started for free today.
                </p>
                <AuthModal />
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-8 border-t border-border text-center text-muted-foreground">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} CalHamed. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
