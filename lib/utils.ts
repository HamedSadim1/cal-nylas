import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FORM_FIELDS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Safely extract a string value from FormData, throwing if missing or not a string. */
export function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string") {
    throw new Error(`Form field "${key}" is required`);
  }
  return value;
}

/**
 * Safely extract a finite numeric value from FormData, throwing if missing
 * or non-numeric. Sibling of {@link getFormString} for parallel SSOT
 * coverage — used wherever a server action consumes a number field
 * (e.g. `meetingLength` in `createMeetingAction`). Catches:
 *
 *   - `formData.get(key)` returning `null` (unsubmitted form field).
 *   - `Number("")`, `Number("abc")`, `Number(undefined)` → NaN.
 *
 * @param formData - The submitted FormData.
 * @param key      - The form field key.
 * @returns The parsed number.
 * @throws If the value is missing or not a finite number.
 */
export function getFormNumber(formData: FormData, key: string): number {
  const value = formData.get(key);
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new Error(
      `Form field "${key}" is not a valid number (got ${JSON.stringify(value)})`,
    );
  }
  return num;
}

/**
 * One row of the availability form, in the shape `updateAvailabilityAction`
 * feeds straight into a `prisma.availability.update({ where: { id }, data: {
 * isActive, fromTime, tillTime } })`.
 */
export interface AvailabilityFormRow {
  id: string;
  isActive: boolean;
  fromTime: string;
  tillTime: string;
}

/**
 * Parses the `updateAvailabilityAction` FormData into an array of
 * {@link AvailabilityFormRow} — one row per availability record.
 *
 * Each row in `app/dashboard/availability/page.tsx` emits four inputs keyed
 * to its database id:
 *   - hidden `` `${FORM_FIELDS.ID}-${id}` ``
 *   - Switch `` `${FORM_FIELDS.IS_ACTIVE}-${id}` ``   (browser submits value `"on"` when active)
 *   - Select `` `${FORM_FIELDS.FROM_TIME}-${id}` ``   (`"HH:mm"`)
 *   - Select `` `${FORM_FIELDS.TILL_TIME}-${id}` ``   (`"HH:mm"`)
 *
 * The four keys share the same suffix so a single flat FormData carries all
 * rows, and the `` `${FORM_FIELDS.ID}-` `` prefix is the marker that delimits rows.
 *
 * Rows whose `` `${FORM_FIELDS.FROM_TIME}-${id}` `` / `` `${FORM_FIELDS.TILL_TIME}-${id}` `` fields are absent are
 * silently skipped. That happens when `item.isActive` is `false` at SSR time
 * (the Selects are conditionally rendered and not in the DOM), preventing
 * the previous latent bug where the old inline `String(rawData[...])`
 * would write the literal string `"undefined"` into the database for every
 * inactive row.
 *
 * @param formData - The FormData submitted by `app/dashboard/availability/page.tsx`.
 * @returns The parsed rows; only rows that contributed a complete timeslot
 *          pair are returned, in the order their `id-` keys appear.
 */
export function parseAvailabilityForm(
  formData: FormData,
): AvailabilityFormRow[] {
  const raw = Object.fromEntries(formData.entries()) as Record<
    string,
    FormDataEntryValue
  >;
  const idPrefix = `${FORM_FIELDS.ID}-`;
  return Object.keys(raw)
    .filter((key) => key.startsWith(idPrefix))
    .map<AvailabilityFormRow | null>((key) => {
      const id = key.slice(idPrefix.length);
      const fromTime = raw[`${FORM_FIELDS.FROM_TIME}-${id}`];
      const tillTime = raw[`${FORM_FIELDS.TILL_TIME}-${id}`];
      // Rows where the Selects weren't rendered (item.isActive === false at
      // SSR) contribute no time fields — drop them so we don't write junk to
      // the database.
      if (typeof fromTime !== "string" || typeof tillTime !== "string") {
        return null;
      }
      return {
        id,
        isActive: raw[`${FORM_FIELDS.IS_ACTIVE}-${id}`] === "on",
        fromTime,
        tillTime,
      };
    })
    .filter((row): row is AvailabilityFormRow => row !== null);
}
