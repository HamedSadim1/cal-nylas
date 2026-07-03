import { Button } from "@/components/ui/button";
import { type AriaButtonProps, useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import type { CalendarState } from "@react-stately/calendar";
import { useRef } from "react";

/**
 * A button component specifically designed for calendar-related actions.
 * It integrates with the AriaButtonProps and CalendarState to provide
 * accessibility and state management features.
 *
 * @param props - The properties for the CalendarButton component.
 * @param props.state - Optional state object for managing calendar state.
 * @param props.side - Optional side indicator, can be "left" or "right".
 * @returns A button element with accessibility and focus ring properties.
 */
export function CalendarButton(
  props: AriaButtonProps<"button"> & {
    state?: CalendarState;
    side?: "left" | "right";
  }
) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  const { focusProps } = useFocusRing();
  return (
    <Button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      disabled={props.isDisabled}
      variant="outline"
      size="icon"
    >
      {props.children}
    </Button>
  );
}
