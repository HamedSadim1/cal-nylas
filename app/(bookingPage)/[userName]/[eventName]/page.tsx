import { createMeetingAction } from "@/lib/actions/action";
import { RenderCalendar } from "@/components/calender/RenderCalendar";
import { SubmitButton } from "@/components/SubmitButton";
import { TimeSlots } from "@/components/TimeSlots";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";
import { BookMarked, CalendarX2, Clock } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

async function getData(username: string, eventName: string) {
  const eventType = await prisma.eventType.findFirst({
    where: {
      url: eventName,
      user: {
        userName: username,
      },
      active: true,
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoCallSoftware: true,

      user: {
        select: {
          image: true,
          name: true,
          Availability: {
            select: {
              day: true,
              isActive: true,
            },
          },
        },
      },
    },
  });
  console.log("🚀 ~ getData ~ eventType:", eventType);

  if (!eventType) {
    return notFound();
  }

  return eventType;
}
interface BookingPageProps {
  params: Promise<{ userName: string; eventName: string }>;
  searchParams: Promise<{ date?: string; time?: string }>;
}
/**
 * BookingPage component renders a booking interface for a specific event.
 * It fetches event data based on the provided userName and eventName parameters,
 * and displays a form for booking a meeting if date and time are provided in the search parameters.
 * Otherwise, it shows the event details and available time slots.
 *
 * @param {BookingPageProps} props - The properties for the BookingPage component.
 * @param {object} props.params - The route parameters.
 * @param {string} props.params.userName - The username of the event organizer.
 * @param {string} props.params.eventName - The name of the event.
 * @param {object} props.searchParams - The search parameters from the URL.
 * @param {string} [props.searchParams.date] - The selected date for the booking.
 * @param {string} [props.searchParams.time] - The selected time for the booking.
 *
 * @returns {JSX.Element} The rendered BookingPage component.
 */
const BookingPage = async ({ params, searchParams }: BookingPageProps) => {
  const [searchParamsData, paramsData] = await Promise.all([
    searchParams,
    params,
  ]);

  const { date, time } = searchParamsData;
  const { userName, eventName } = paramsData;
  // console.log("🚀 ~ BookingPage ~ userName:", userName);
  // console.log("🚀 ~ BookingPage ~ eventName:", eventName);

  console.log(decodeURI(userName));
  const eventType = await getData(decodeURI(userName), eventName);
  // console.log("🚀 ~ BookingPage ~ eventType:", eventType);
  const selectedDate = date ? new Date(date) : new Date();

  const formattedDate = new Intl.DateTimeFormat("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);

  const showForm = !!date && !!time;

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      {showForm ? (
        <Card className="max-w-150">
          <CardContent className="p-5 grid md:grid-cols-[1fr,auto,1fr] gap-4">
            <div>
              {eventType.user.image ? (
                <Image
                  src={eventType.user.image}
                  alt={`${eventType.user.name}'s profile picture`}
                  className="size-9 rounded-full"
                  width={30}
                  height={30}
                />
              ) : (
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {(eventType.user.name || "?").charAt(0)}
                  </span>
                </div>
              )}
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {eventType.user.name}
              </p>
              <h1 className="text-xl font-semibold mt-2">{eventType.title}</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {eventType.description}
              </p>

              <div className="mt-5 grid gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {formattedDate}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {eventType.duration} Mins
                  </span>
                </p>
                <p className="flex items-center">
                  <BookMarked className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {eventType.videoCallSoftware}
                  </span>
                </p>
              </div>
            </div>
            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-px"
            />

            <form
              className="flex flex-col gap-y-4"
              action={createMeetingAction}
            >
              <input type="hidden" name="eventTypeId" value={eventType.id} />
              <input type="hidden" name="username" value={userName} />
              <input type="hidden" name="fromTime" value={time} />
              <input type="hidden" name="eventDate" value={date} />
              <input
                type="hidden"
                name="meetingLength"
                value={eventType.duration}
              />
              <div className="flex flex-col gap-y-1">
                <Label>Your Name</Label>
                <Input name="name" placeholder="Your Name" />
              </div>

              <div className="flex flex-col gap-y-1">
                <Label>Your Email</Label>
                <Input name="email" placeholder="johndoe@gmail.com" />
              </div>

              <SubmitButton text="Book Meeting" />
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-250 mx-auto">
          <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr] md:gap-4">
            <div>
              {eventType.user.image ? (
                <Image
                  src={eventType.user.image}
                  alt={`${eventType.user.name}'s profile picture`}
                  className="size-9 rounded-full"
                  width={30}
                  height={30}
                />
              ) : (
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {(eventType.user.name || "?").charAt(0)}
                  </span>
                </div>
              )}
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {eventType.user.name}
              </p>
              <h1 className="text-xl font-semibold mt-2">{eventType.title}</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {eventType.description}
              </p>
              <div className="mt-5 grid gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {formattedDate}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {eventType.duration} Mins
                  </span>
                </p>
                <p className="flex items-center">
                  <BookMarked className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Google Meet
                  </span>
                </p>
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-px"
            />

            <div className="my-4 md:my-0">
              <RenderCalendar daysofWeek={eventType.user.Availability} />
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-px"
            />
            <TimeSlots
              selectedDate={selectedDate}
              userName={userName}
              meetingDuration={eventType.duration}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingPage;
