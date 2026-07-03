import {
  DateDuration,
  endOfMonth,
  getWeeksInMonth,
} from "@internationalized/date";
import { DateValue, useCalendarGrid, useLocale } from "react-aria";
import { CalendarState } from "react-stately";
import { CalendarCell } from "./CalendarCell";

export function CalendarGrid({
  state,
  offset = {},
  isDateUnavailable,
}: {
  state: CalendarState;
  offset?: DateDuration;
  isDateUnavailable?: (date: DateValue) => boolean;
}) {
  // Calculate the start date of the month based on the given offset.
  const startDate = state.visibleRange.start.add(offset);
  // Calculate the end date of the month.
  const endDate = endOfMonth(startDate);

  // Get the locale from the context. This locale will be used for formatting dates.
  const { locale } = useLocale();
  // get the grid props and header and weeksdays props from useCalendarGrid
  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    {
      startDate,
      endDate,
      weekdayStyle: "short",
    },
    state
  );

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(startDate, locale);
  return (
    <table {...gridProps} cellPadding="0" className="flex-1">
      <thead {...headerProps} className=" text-sm font-medium">
        <tr>
          {weekDays.map((day, index) => (
            <th key={index}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Render the calendar cells for each week in the month */}
        {Array.from({ length: weeksInMonth }, (_, weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex, startDate)
              .map((date, i) =>
                date ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    currentMonth={startDate}
                    isUnavailable={isDateUnavailable?.(date)}
                  />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
