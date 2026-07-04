import { format, parse } from "date-fns";
import { nlBE } from "date-fns/locale";
import { LOCALE } from "./constants";

// ─── Date/time format strings (SSOT for date-fns `format(d, …)` calls) ────────
/**
 * Single source of truth for every date/time format string used across the app.
 * Any literal `"EEEE"`, `"HH:mm"`, `"yyyy-MM-dd"`, `"EEE"`, `"MMM. d"` in
 * components or actions should be replaced with one of these constants so a
 * UI-wide format change is a one-file edit.
 */
export const DATE_FORMATS = {
  /** Long weekday name, e.g. "Monday" (locale-dependent, e.g. "maandag"). */
  WEEKDAY_LONG: "EEEE",
  /** Short weekday name, e.g. "Mon". */
  WEEKDAY_SHORT: "EEE",
  /** Long month name, e.g. "May" (locale-dependent, e.g. "mei"). */
  MONTH_LONG: "MMMM",
  /** Numeric day-of-month, no leading zero, e.g. "4". */
  DAY_NUMERIC: "d",
  /** Short month + day with a literal dot separator, e.g. "May. 4". */
  MONTH_DAY: "MMM. d",
  /** ISO calendar date, e.g. "2026-07-04". */
  CALENDAR_DATE: "yyyy-MM-dd",
  /** Time of day, e.g. "09:30". */
  TIME_HOUR_MINUTE: "HH:mm",
} as const;

// ─── Locale registry ──────────────────────────────────────────────────────────
/**
 * Maps each user-facing `LOCALE` string in `lib/constants.ts` to its matching
 * `date-fns/locale` `Locale` object. This is the single place `date-fns`
 * locale data is imported — callers never need `import { nlBE } from
 * "date-fns/locale"` directly.
 *
 * Why a registry instead of `import { nlBE }` at the top-level: when the i18n
 * story grows, adding `"en-US": enUS, "fr-FR": frFR, …` is a one-line change
 * and `formatLongDate(d, "en-US")` Just Works without hunting call sites.
 */
export const DATE_LOCALES = {
  [LOCALE]: nlBE,
} as const;

/** Keys of {@link DATE_LOCALES}. Extend the registry to widen this union. */
export type SupportedLocale = keyof typeof DATE_LOCALES;

/** The project's default user-facing locale for date formatting. */
export const DEFAULT_LOCALE: SupportedLocale = LOCALE;

// ─── Locale-aware formatting helpers ─────────────────────────────────────────
/**
 * Formats a date in user-facing long-form: `{WEEKDAY_LONG} {DAY_NUMERIC}
 * {MONTH_LONG}` with the project's default locale. Centralizes the only
 * previous `new Intl.DateTimeFormat(LOCALE, { weekday: "long", day: "numeric",
 * month: "long" }).format(d)` call site (the booking page).
 *
 * Pass a non-default `localeKey` to render for an alternate locale. Adding a
 * new locale is one entry in {@link DATE_LOCALES}.
 */
export function formatLongDate(
  date: Date,
  localeKey: SupportedLocale = DEFAULT_LOCALE,
): string {
  return format(
    date,
    `${DATE_FORMATS.WEEKDAY_LONG} ${DATE_FORMATS.DAY_NUMERIC} ${DATE_FORMATS.MONTH_LONG}`,
    { locale: DATE_LOCALES[localeKey] },
  );
}

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

// ─── Slot enumeration ─────────────────────────────────────────────────────────

const pad2 = (n: number): string => String(n).padStart(2, "0");

/**
 * Generate a 24-hour time-slot enumeration at the given `stepMinutes`.
 * The step must evenly divide 60 (e.g. 1, 2, 3, 5, 10, 15, 20, 30, 60);
 * other values throw so the caller fixes the input rather than getting a
 * silently-truncated tail.
 *
 *   stepMinutes=30  → 48 slots, last = `"23:30"`
 *   stepMinutes=15  → 96 slots, last = `"23:45"`
 *   stepMinutes=60  → 24 slots, last = `"23:00"`
 *
 * Used by the dashboard's availability UI to populate the From/To Selects.
 */
export function generateTimeSlots(
  stepMinutes: number,
): ReadonlyArray<{ readonly id: number; readonly time: string }> {
  if (
    !Number.isInteger(stepMinutes) ||
    stepMinutes <= 0 ||
    60 % stepMinutes !== 0
  ) {
    throw new Error(
      `generateTimeSlots: stepMinutes must be a positive integer that evenly divides 60 (got ${stepMinutes})`,
    );
  }
  const slotsPerDay = (24 * 60) / stepMinutes;
  return Array.from({ length: slotsPerDay }, (_, i) => {
    const totalMinutes = i * stepMinutes;
    return {
      id: i,
      time: `${pad2(Math.floor(totalMinutes / 60))}:${pad2(totalMinutes % 60)}`,
    };
  });
}

/** Default 30-minute slots (`00:00` → `23:30`). Backs the dashboard availability UI. */
export const times = generateTimeSlots(30);

// ─── Day-index helper ────────────────────────────────────────────────────────
/**
 * Convert a JavaScript-style `Date.getDay()` value (0 = Sunday, 1 = Monday,
 * …, 6 = Saturday) to the index into {@link DAYS_OF_WEEK} (0 = Monday,
 * 1 = Tuesday, …, 6 = Sunday).
 *
 *   getDay=0 (Sunday)   → 6
 *   getDay=1 (Monday)   → 0
 *   getDay=2 (Tuesday)  → 1
 *   …
 *   getDay=6 (Saturday) → 5
 *
 * Used by the booking-page calendar
 * (`components/calender/RenderCalendar.tsx`) to look up
 * `daysofWeek[idx].isActive`. Lives next to the rest of the date helpers
 * because it's strictly a calendar-day conversion — no `date-fns` use.
 */
export function jsDayToAvailabilityIndex(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}
