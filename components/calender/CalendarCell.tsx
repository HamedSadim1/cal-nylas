import { cn } from "@/lib/utils";
import {
  CalendarDate,
  getLocalTimeZone,
  isSameMonth,
  isToday,
} from "@internationalized/date";
import { useRef } from "react";
import { mergeProps, useCalendarCell, useFocusRing } from "react-aria";
import { CalendarState } from "react-stately";

/**
 * Renders a calendar cell component.
 *
 * @param {Object} props - The properties object.
 * @param {CalendarState} props.state - The state of the calendar.
 * @param {CalendarDate} props.date - The date for this cell.
 * @param {CalendarDate} props.currentMonth - The current month being displayed.
 * @param {boolean} [props.isUnavailable] - Optional flag indicating if the date is unavailable.
 *
 * @returns {JSX.Element} The rendered calendar cell component.
 */
export function CalendarCell({
  state,
  date,
  currentMonth,
  isUnavailable,
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
  isUnavailable?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } =
    useCalendarCell({ date }, state, ref);

  // Override isDisabled if the date is unavailable
  const finalIsDisabled = isDisabled || isUnavailable;

  // Get the focus props and check if the cell is focused
  const { focusProps, isFocusVisible } = useFocusRing();

  // Check if the cell is outside the current month and set the display accordingly
  const isOutsideMonth = !isSameMonth(currentMonth, date);

  // Check if the date is today and set the background color accordingly
  const isDateToday = isToday(date, getLocalTimeZone());

  return (
    <td
      {...cellProps}
      className={`py-0.5 px-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideMonth}
        className="size-10 sm:size-12 outline-none group rounded-md"
      >
        <div
          className={cn(
            "size-full rounded-sm flex items-center justify-center text-sm font-semibold",
            finalIsDisabled ? "text-muted-foreground cursor-not-allowed" : "",
            isFocusVisible ? "group-focus:z-2 ring-gray-12 ring-offset-1" : "",
            isSelected ? "bg-primary text-white" : "",
            !isSelected && !finalIsDisabled
              ? "hover:bg-blue-500/10 bg-secondary"
              : ""
          )}
        >
          {formattedDate}
          {isDateToday && (
            <div
              className={cn(
                "absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 size-1.5 bg-primary rounded-full",
                isSelected && "bg-white"
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
}
