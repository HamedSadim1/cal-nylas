import type { AriaButtonProps } from "@react-aria/button";
import { useDateFormatter } from "@react-aria/i18n";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import type { CalendarState } from "@react-stately/calendar";
import type { DOMAttributes, FocusableElement } from "@react-types/shared";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { CalendarButton } from "./CalendarButton";

/**
 * Renders the header of the calendar component.
 *
 * @param {Object} props - The properties for the CalendarHeader component.
 * @param {CalendarState} props.state - The state of the calendar.
 * @param {DOMAttributes<FocusableElement>} props.calendarProps - The properties for the calendar element.
 * @param {AriaButtonProps<"button">} props.prevButtonProps - The properties for the previous button.
 * @param {AriaButtonProps<"button">} props.nextButtonProps - The properties for the next button.
 *
 * @returns {JSX.Element} The rendered CalendarHeader component.
 */
export function CalendarHeader({
  state,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
}: {
  state: CalendarState;
  calendarProps: DOMAttributes<FocusableElement>;
  prevButtonProps: AriaButtonProps<"button">;
  nextButtonProps: AriaButtonProps<"button">;
}) {
  // Get the month and year for the visible range in the calendar.
  const monthDateFormatter = useDateFormatter({
    month: "short",
    year: "numeric",
    timeZone: state.timeZone,
  });

  // Extract the month and year from the start of the visible range. formateToParts returns an array of objects with the type and value of each part of the formatted date. map is used to extract the value of each part.
  const [monthName, , year] = monthDateFormatter
    .formatToParts(state.visibleRange.start.toDate(state.timeZone))
    .map((part) => part.value);

  return (
    <div className="flex items-center pb-4">
      <VisuallyHidden>
        <h2>{calendarProps["aria-label"]}</h2>
      </VisuallyHidden>

      <h2 aria-hidden className="flex-1 align-center font-semibold text-base">
        {monthName}{" "}
        <span className="text-muted-foreground text-sm font-medium">
          {year}
        </span>
      </h2>
      <div className="flex items-center gap-2">
        <CalendarButton {...prevButtonProps}>
          <ChevronLeftIcon className="size-4" />
        </CalendarButton>
        <CalendarButton {...nextButtonProps}>
          <ChevronRightIcon className="size-4" />
        </CalendarButton>
      </div>
    </div>
  );
}
