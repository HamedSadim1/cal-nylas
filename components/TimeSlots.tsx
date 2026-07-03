import {
  addMinutes,
  format,
  fromUnixTime,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import prisma from "../lib/db";
import { Prisma } from "@prisma/client";
import { nylas } from "../lib/nylas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NylasResponse, GetFreeBusyResponse, FreeBusyType } from "nylas";

interface iappProps {
  selectedDate: Date;
  userName: string;
  meetingDuration: number;
}

async function getAvailability(selectedDate: Date, userName: string) {
  console.log("🚀 ~ getAvailability ~ userName:", userName);
  // Get the current day of the week
  const currentDay = format(selectedDate, "EEEE");

  // Set the start and end of the day
  const startOfDay = new Date(selectedDate);
  // Set the time to 00:00:00
  startOfDay.setHours(0, 0, 0, 0);
  // end of the day is 23:59:59
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

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
  if (!data?.User?.grantId || !data?.User?.grantEmail) {
    throw new Error("User has not connected their calendar");
  }

  // Get free/busy data from Nylas for the selected day and user
  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: data.User.grantId,
    requestBody: {
      // Convert the start and end of the day to Unix timestamps
      startTime: Math.floor(startOfDay.getTime() / 1000),
      // Convert the end of the day to a Unix timestamp
      endTime: Math.floor(endOfDay.getTime() / 1000),
      // Specify the user's email for the free/busy data
      emails: [data.User.grantEmail],
    },
  });

  return { data, nylasCalendarData };
}

/**
 * Calculates available time slots based on database availability and Nylas busy slots.
 *
 * @param dbAvailability - An object containing the start and end times of availability from the database.
 * @param nylasData - The response from Nylas API containing busy time slots.
 * @param date - The date for which to calculate the available time slots in "yyyy-MM-dd" format.
 * @param duration - The duration of each time slot in minutes.
 * @returns An array of available time slots formatted as "HH:mm".
 */
function calculateAvailableTimeSlots(
  dbAvailability: {
    fromTime: string | undefined;
    tillTime: string | undefined;
  },
  nylasData: NylasResponse<GetFreeBusyResponse[]>,
  date: string,
  duration: number
) {
  const now = new Date(); // Get the current time

  // Convert DB availability to Date objects
  const availableFrom = parse(
    `${date} ${dbAvailability.fromTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const availableTill = parse(
    `${date} ${dbAvailability.tillTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  // Extract busy slots from Nylas data.
  // `getFreeBusy()` returns `NylasResponse<FreeBusy[]>` where each item is
  // a `FreeBusy | FreeBusyError` union; only the `FreeBusy` arm exposes `timeSlots`.
  // TypeScript narrows the union on the discriminator without us needing a cast.
  const busySlots = nylasData.data
    .filter((entry) => entry.object === FreeBusyType.FREE_BUSY)
    .flatMap((entry) => entry.timeSlots)
    .map((slot) => ({
      start: fromUnixTime(slot.startTime),
      end: fromUnixTime(slot.endTime),
    }));
  // Generate all possible 30-minute slots within the available time
  const allSlots = [];
  let currentSlot = availableFrom;
  while (isBefore(currentSlot, availableTill)) {
    allSlots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, duration);
  }

  // Filter out busy slots and slots before the current time
  const freeSlots = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, duration);
    return (
      isAfter(slot, now) && // Ensure the slot is after the current time
      !busySlots.some(
        (busy: { start: Date; end: Date }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
      )
    );
  });

  // Format the free slots
  return freeSlots.map((slot) => format(slot, "HH:mm"));
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
    userName
  );

  // Extract DB availability data from the response object
  const dbAvailability = { fromTime: data?.fromTime, tillTime: data?.tillTime };

  // Format the selected date for display purposes
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Calculate available time slots based on DB availability and Nylas calendar data for the selected date
  const availableSlots = calculateAvailableTimeSlots(
    dbAvailability,
    nylasCalendarData,
    formattedDate,
    meetingDuration
  );

  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, "EEE")}.{" "}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, "MMM. d")}
        </span>
      </p>

      <div className="mt-3 max-h-[350px] overflow-y-auto">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <Link
              key={index}
              href={`?date=${format(selectedDate, "yyyy-MM-dd")}&time=${slot}`}
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
