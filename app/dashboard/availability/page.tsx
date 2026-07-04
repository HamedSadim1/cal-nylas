import { SubmitButton } from "@/components/SubmitButton";
import prisma from "@/lib/db";
import { times } from "@/lib/times";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IconCardHeader } from "@/components/IconCardHeader";
import { PageContainer } from "@/components/PageContainer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";
import React from "react";
import { updateAvailabilityAction } from "@/lib/actions/action";
import { requireUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { CalendarCheck, Clock } from "lucide-react";

type AvailabilityRow = Awaited<ReturnType<typeof getData>>[number];

async function getData(userId: string) {
  const data = await prisma.availability.findMany({
    where: { userId },
  });

  if (!data) return notFound();
  return data;
}

const AvailabilityPage = async () => {
  const session = await requireUser({ redirectTo: ROUTES.HOME });
  const data = await getData(session.user.id);

  return (
    <PageContainer>
      <Card className="border-border/60 shadow-lg">
        <IconCardHeader
          icon={CalendarCheck}
          title="Availability"
          description="Set your weekly availability for scheduling"
        />

        <form action={updateAvailabilityAction}>
          <CardContent className="flex flex-col gap-y-3 pt-2">
            {data.map((item: AvailabilityRow) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <input type="hidden" name={`id-${item.id}`} value={item.id} />
                <div className="flex items-center gap-3 min-w-30">
                  <Switch
                    name={`isActive-${item.id}`}
                    defaultChecked={item.isActive}
                  />
                  <span
                    className={`text-sm font-medium ${
                      item.isActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
                {item.isActive ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Select
                      name={`fromTime-${item.id}`}
                      defaultValue={item.fromTime}
                    >
                      <SelectTrigger className="w-full">
                        <Clock className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {times.map((time) => (
                            <SelectItem key={time.id} value={time.time}>
                              {time.time}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground shrink-0">
                      to
                    </span>
                    <Select
                      name={`tillTime-${item.id}`}
                      defaultValue={item.tillTime}
                    >
                      <SelectTrigger className="w-full">
                        <Clock className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {times.map((time) => (
                            <SelectItem key={time.id} value={time.time}>
                              {time.time}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </div>
            ))}
          </CardContent>

          <CardFooter className="border-t border-border pt-6">
            <SubmitButton text="Save Changes" className="w-full" />
          </CardFooter>
        </form>
      </Card>
    </PageContainer>
  );
};

export default AvailabilityPage;
