"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "./Calendar";
import { useState, useEffect } from "react";
import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
  today,
  parseDate,
} from "@internationalized/date";
import { jsDayToAvailabilityIndex } from "@/lib/times";

interface iAppProps {
  daysofWeek: { day: string; isActive: boolean }[];
}

/**
 * Renders a calendar component with the ability to navigate and select dates.
 * The selected date is synchronized with the URL search parameters.
 *
 * @param {iAppProps} props - The properties for the component.
 * @param {Array<{ isActive: boolean }>} props.daysofWeek - An array representing the days of the week,
 * where each element indicates whether the corresponding day is active.
 *
 * @returns {JSX.Element} The rendered calendar component.
 *
 * @component
 *
 * @example
 * const daysofWeek = [
 *   { isActive: true },  // Monday
 *   { isActive: true },  // Tuesday
 *   { isActive: true },  // Wednesday
 *   { isActive: true },  // Thursday
 *   { isActive: true },  // Friday
 *   { isActive: false }, // Saturday
 *   { isActive: false }  // Sunday
 * ];
 *
 * <RenderCalendar daysofWeek={daysofWeek} />
 */
export function RenderCalendar({ daysofWeek }: iAppProps) {
  // Get the router and search params
  const router = useRouter();
  // Get the search parameters from the current URL and parse the date parameter if available.
  const searchParams = useSearchParams();

  // Initialize the selected date state with the current date or the date from the search parameters.
  const [date, setDate] = useState<CalendarDate>(() => {
    // Parse the date parameter from the search parameters if available. Otherwise, use the current date.
    const dateParam = searchParams.get("date");
    return dateParam ? parseDate(dateParam) : today(getLocalTimeZone());
  });

  // Update the selected date state when the date parameter in the search parameters changes.
  useEffect(() => {
    // Parse the date parameter from the search parameters if available and update the selected date state.
    const dateParam = searchParams.get("date");
    if (dateParam) {
      setDate(parseDate(dateParam));
    }
  }, [searchParams]);

  // Update the search parameters when the selected date changes.
  const handleChangeDate = (date: DateValue) => {
    console.log(date);
    setDate(date as CalendarDate);
    const url = new URL(window.location.href);

    url.searchParams.set("date", date.toString());

    router.push(url.toString());
  };

  // Check if a given date is unavailable based on the day of the week.
  const isDateUnavailable = (date: DateValue) => {
    // Date.getDay() returns 0 = Sunday … 6 = Saturday; map that onto the
    // 0 = Monday … 6 = Sunday ordering of `daysofWeek` via the SSOT helper
    // in `lib/times.ts`.
    const jsDay = date.toDate(getLocalTimeZone()).getDay();
    return !daysofWeek[jsDayToAvailabilityIndex(jsDay)].isActive;
  };

  return (
    <Calendar
      minValue={today(getLocalTimeZone())}
      defaultValue={today(getLocalTimeZone())}
      value={date}
      onChange={handleChangeDate}
      isDateUnavailable={isDateUnavailable}
    />
  );
}
