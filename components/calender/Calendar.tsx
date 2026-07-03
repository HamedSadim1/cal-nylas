import { createCalendar } from "@internationalized/date";
import { CalendarProps, DateValue, useCalendar, useLocale } from "react-aria";
import { useCalendarState } from "react-stately";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";

/**
 * Renders a calendar component with navigation buttons and a grid of dates.
 *
 * @param props - The properties for the Calendar component.
 * @param props.isDateUnavailable - Optional function to determine if a date is unavailable.
 * @returns A JSX element representing the calendar.
 */
export function Calendar(
  props: CalendarProps<DateValue> & {
    isDateUnavailable?: (date: DateValue) => boolean;
  }
) {
  // Get the locale from the context
  const { locale } = useLocale();
  // Create a calendar using the provided locale
  // 1 month visible at a time
  const state = useCalendarState({
    ...props,
    visibleDuration: { months: 1 },
    locale,
    createCalendar,
  });

  // Get the calendar props and button props from the useCalendar hook to pass to the CalendarHeader component and CalendarGrid component
  const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  );
  return (
    <div {...calendarProps} className="inline-block ">
      <CalendarHeader
        state={state}
        calendarProps={calendarProps}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <div className="flex gap-8">
        <CalendarGrid
          state={state}
          isDateUnavailable={props.isDateUnavailable}
        />
      </div>
    </div>
  );
}
