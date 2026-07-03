import { SubmitButton } from "@/components/SubmitButton";
import prisma from "@/lib/db";
import { times } from "@/lib/times";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { auth } from "@/auth";

// Inferred from the actual findMany return — narrower than
// `Prisma.AvailabilityGetPayload<{}>` because it matches the runtime shape.
type AvailabilityRow = Awaited<ReturnType<typeof getData>>[number];

async function getData(userId: string) {
  const data = await prisma.availability.findMany({
    where: {
      userId: userId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

const AvailabilityPage = async () => {
  const session = await auth();

  if (!session) {
    return notFound();
  }

  const data = await getData(session.user?.id as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>
          In this section you can manage your availability.
        </CardDescription>
      </CardHeader>
      <form action={updateAvailabilityAction}>
        <CardContent className="flex flex-col gap-y-4">
          {data.map((item: AvailabilityRow) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4"
              key={item.id}
            >
              <input type="hidden" name={`id-${item.id}`} value={item.id} />
              <div className="flex items-center gap-x-3">
                <Switch
                  name={`isActive-${item.id}`}
                  defaultChecked={item.isActive}
                />
                <p>{item.day}</p>
              </div>
              {item.isActive ? (
                <>
                  <Select
                    name={`fromTime-${item.id}`}
                    defaultValue={item.fromTime}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="From Time" />
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
                  <Select
                    name={`tillTime-${item.id}`}
                    defaultValue={item.tillTime}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="To Time" />
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
                </>
              ) : null}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
};

export default AvailabilityPage;
