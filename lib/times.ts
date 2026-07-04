import { parse } from "date-fns";

// ─── Date/time format strings (SSOT for date-fns `format(d, …)` calls) ────────
/**
 * Single source of truth for every date/time format string used across the app.
 * Any literal `"EEEE"`, `"HH:mm"`, `"yyyy-MM-dd"`, `"EEE"`, `"MMM. d"` in
 * components or actions should be replaced with one of these constants so a
 * UI-wide format change is a one-file edit.
 */
export const DATE_FORMATS = {
  /** Long weekday name, e.g. "Monday". Used to query Prisma `Availability.day` enum. */
  WEEKDAY_LONG: "EEEE",
  /** Short weekday name, e.g. "Mon". */
  WEEKDAY_SHORT: "EEE",
  /** Short month + day with a literal dot separator, e.g. "May. 4". */
  MONTH_DAY: "MMM. d",
  /** ISO calendar date, e.g. "2026-07-04". */
  CALENDAR_DATE: "yyyy-MM-dd",
  /** Time of day, e.g. "09:30". */
  TIME_HOUR_MINUTE: "HH:mm",
} as const;

// ─── Parsing helpers ──────────────────────────────────────────────────────────
/**
 * Combine a `CALENDAR_DATE` (e.g. `"2026-07-04"`) and a `TIME_HOUR_MINUTE`
 * (e.g. `"09:30"`) into a single `Date`.
 *
 * Was previously duplicated as `new Date(\`${date}T${time}:00\`)` in
 * `lib/actions/action.ts` and `date-fns parse(...)` calls in
 * `components/TimeSlots.tsx`.
 */
export function parseDateTime(dateStr: string, timeStr: string): Date {
  return parse(
    `${dateStr} ${timeStr}`,
    `${DATE_FORMATS.CALENDAR_DATE} ${DATE_FORMATS.TIME_HOUR_MINUTE}`,
    new Date(),
  );
}

// ─── Day-bounds helper ───────────────────────────────────────────────────────
/**
 * Returns the local-time start (`00:00:00.000`) and end (`23:59:59.999`) of
 * the calendar day for the given date. Replaces the inline
 * `setHours(0,0,0,0)` / `setHours(23,59,59,999)` pair (which was duplicated
 * wherever a full-day window was needed, e.g. Nylas free/busy queries).
 */
export function getDayBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// ─── Unix-time helper (what Nylas expects) ───────────────────────────────────
/**
 * Convert a `Date` to whole-second Unix epoch (rounded down). Replaces
 * `Math.floor(date.getTime() / 1000)` duplicated in Nylas call sites.
 */
export function toUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

// ─── Slot enumeration (30-minute increments, 00:00 → 23:30) ──────────────────
//
// Used by the dashboard availability UI to populate the From/To time Selects.
// Kept as an explicit array (rather than generated) so the UI sees a stable
// id+time pairing and to avoid depending on user's locale for `format`.
export const times = [
  { id: 0, time: "00:00" },
  { id: 1, time: "00:30" },
  { id: 2, time: "01:00" },
  { id: 3, time: "01:30" },
  { id: 4, time: "02:00" },
  { id: 5, time: "02:30" },
  { id: 6, time: "03:00" },
  { id: 7, time: "03:30" },
  { id: 8, time: "04:00" },
  { id: 9, time: "04:30" },
  { id: 10, time: "05:00" },
  { id: 11, time: "05:30" },
  { id: 12, time: "06:00" },
  { id: 13, time: "06:30" },
  { id: 14, time: "07:00" },
  { id: 15, time: "07:30" },
  { id: 16, time: "08:00" },
  { id: 17, time: "08:30" },
  { id: 18, time: "09:00" },
  { id: 19, time: "09:30" },
  { id: 20, time: "10:00" },
  { id: 21, time: "10:30" },
  { id: 22, time: "11:00" },
  { id: 23, time: "11:30" },
  { id: 24, time: "12:00" },
  { id: 25, time: "12:30" },
  { id: 26, time: "13:00" },
  { id: 27, time: "13:30" },
  { id: 28, time: "14:00" },
  { id: 29, time: "14:30" },
  { id: 30, time: "15:00" },
  { id: 31, time: "15:30" },
  { id: 32, time: "16:00" },
  { id: 33, time: "16:30" },
  { id: 34, time: "17:00" },
  { id: 35, time: "17:30" },
  { id: 36, time: "18:00" },
  { id: 37, time: "18:30" },
  { id: 38, time: "19:00" },
  { id: 39, time: "19:30" },
  { id: 40, time: "20:00" },
  { id: 41, time: "20:30" },
  { id: 42, time: "21:00" },
  { id: 43, time: "21:30" },
  { id: 44, time: "22:00" },
  { id: 45, time: "22:30" },
  { id: 46, time: "23:00" },
  { id: 47, time: "23:30" },
];
