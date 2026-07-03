import { Button } from "@/components/ui/button";
import { CalendarPlus, PlusCircle } from "lucide-react";
import Link from "next/link";

interface iAppProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export function EmptyState({
  buttonText,
  description,
  href,
  title,
}: iAppProps) {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-2xl border border-dashed border-border/60 p-12 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 mb-6">
        <CalendarPlus className="size-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>
      <Button asChild size="lg" className="gap-2">
        <Link href={href}>
          <PlusCircle className="size-4" />
          {buttonText}
        </Link>
      </Button>
    </div>
  );
}
