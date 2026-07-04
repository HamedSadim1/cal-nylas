import { format, fromUnixTime } from "date-fns";
import {
  BusyRange,
  DATE_FORMATS,
  calculateFreeTimeSlots,
  getDayBounds,
  parseDateTime,
  toUnixSeconds,
} from "../lib/times";
import prisma from "../lib/db";
import { Prisma } from "@prisma/client";
import { nylas } from "../lib/nylas";
import { requireNylasGrant } from "../lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FreeBusyType } from "nylas";

interface iappProps {
  selectedDate: Date;
  userName: string;
  meetingDuration: number;
}

async function getAvailability(selectedDate: Date, userName: string) {
  console.log("🚀 ~ getAvailability ~ userName:", userName);
  // Get the current day of the week
  const currentDay = format(selectedDate, DATE_FORMATS.WEEKDAY_LONG);

  // Set the start and end of the day
  const { start: startOfDay, end: endOfDay } = getDayBounds(selectedDate);

  // Get the availability from the database for the selected day and user
  const data = await prisma.availability.findFirst({
    where: {
      day: currentDay as Prisma.EnumDayFilter,
      User: {
        userName: decodeURI(userName),
      },
    },
    select: {
      fromTime: true,
      tillTime: true,
      id: true,
      User: {
        select: {
          grantEmail: true,
          grantId: true,
        },
      },
    },
  });
  const { grantId, grantEmail } = requireNylasGrant(data?.User);

  // Get free/busy data from Nylas for the selected day and user
  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: grantId,
    requestBody: {
      // Convert the start and end of the day to Unix timestamps
      startTime: toUnixSeconds(startOfDay),
      // Convert the end of the day to a Unix timestamp
      endTime: toUnixSeconds(endOfDay),
      // Specify the user's email for the free/busy data
      emails: [grantEmail],
    },
  });

  return { data, nylasCalendarData };
}

/**
 * Fetches and displays available time slots for a given date and user.
 *
 * @param {Object} props - The properties object.
 * @param {Date} props.selectedDate - The selected date for which to fetch availability.
 * @param {string} props.userName - The username for whom to fetch availability.
 * @param {number} props.meetingDuration - The duration of the meeting in minutes.
 *
 * @returns {JSX.Element} A component that displays available time slots or a message if no slots are available.
 */
export async function TimeSlots({
  selectedDate,
  userName,
  meetingDuration,
}: iappProps) {
  // Fetch availability data and Nylas calendar data
  const { data, nylasCalendarData } = await getAvailability(
    selectedDate,
    userName,
  );

  // Extract DB availability data from the response object
  const dbAvailability = { fromTime: data?.fromTime, tillTime: data?.tillTime };

  // Format the selected date for display purposes
  const formattedDate = format(selectedDate, DATE_FORMATS.CALENDAR_DATE);

  // The pure date-math (slot enumeration + busy overlap) lives in
  // `calculateFreeTimeSlots` in `lib/times.ts`. Here we only transform
  // the Nylas `NylasResponse<GetFreeBusyResponse[]>` shape into the
  // SDK-agnostic `BusyRange[]` the helper expects.
  const availableFrom = parseDateTime(
    formattedDate,
    dbAvailability.fromTime as string,
  );
  const availableTill = parseDateTime(
    formattedDate,
    dbAvailability.tillTime as string,
  );
  // `nylasCalendarData` is already inferred as `NylasResponse<GetFreeBusyResponse[]>`
  // from `nylas.calendars.getFreeBusy(...)`'s return-type chain; each
  // `data[i]` is a `FreeBusy | FreeBusyError` union discriminated by
  // `object`, so the .filter narrows the union on the discriminator without
  // a cast.
  const busyRanges: BusyRange[] = nylasCalendarData.data
    .filter((entry) => entry.object === FreeBusyType.FREE_BUSY)
    .flatMap((entry) => entry.timeSlots)
    .map((slot) => ({
      start: fromUnixTime(slot.startTime),
      end: fromUnixTime(slot.endTime),
    }));

  const availableSlots = calculateFreeTimeSlots(
    availableFrom,
    availableTill,
    busyRanges,
    meetingDuration,
  );

  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, DATE_FORMATS.WEEKDAY_SHORT)}.{" "}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, DATE_FORMATS.MONTH_DAY)}
        </span>
      </p>

      <div className="mt-3 max-h-[350px] overflow-y-auto">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <Link
              key={index}
              href={`?date=${format(selectedDate, DATE_FORMATS.CALENDAR_DATE)}&time=${slot}`}
            >
              <Button variant="outline" className="w-full mb-2">
                {slot}
              </Button>
            </Link>
          ))
        ) : (
          <p>No available time slots for this date.</p>
        )}
      </div>
    </div>
  );
}
