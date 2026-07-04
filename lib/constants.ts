// ─── App Branding ───────────────────────────────────────────────────────────────
export const APP_NAME = "CalHamed" as const;
export const APP_BRAND_SHORT = "Hamed" as const;
export const APP_URL = "CalHamed.com" as const;
export const APP_TITLE = "Calendar App" as const;
export const APP_DESCRIPTION =
  "A simple and efficient calendar application to manage your events and schedules." as const;
/** Use `new Date().getFullYear()` inline to keep the year current across server restarts. */
export function getFooterText() {
  return `© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.`;
}

// ─── Route Paths ────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  DASHBOARD_NEW: "/dashboard/new",
  DASHBOARD_MEETINGS: "/dashboard/meetings",
  DASHBOARD_AVAILABILITY: "/dashboard/availability",
  DASHBOARD_SETTINGS: "/dashboard/settings",
  DASHBOARD_EVENT: "/dashboard/event",
  ONBOARDING: "/onboarding",
  ONBOARDING_GRANT_ID: "/onboarding/grand-id",
  SUCCESS: "/success",
  API_AUTH: "/api/auth",
  API_OAUTH_EXCHANGE: "/api/oauth/exchange",
} as const;

// ─── Days of the Week ───────────────────────────────────────────────────────────
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// ─── Default Availability ───────────────────────────────────────────────────────
export const DEFAULT_AVAILABILITY = {
  FROM_TIME: "08:00",
  TILL_TIME: "18:00",
} as const;

// ─── Video Call Platforms ───────────────────────────────────────────────────────
export const PLATFORMS = {
  ZOOM: "Zoom Meeting",
  GOOGLE_MEET: "Google Meet",
  MICROSOFT_TEAMS: "Microsoft Teams",
} as const;

export type Platform = (typeof PLATFORMS)[keyof typeof PLATFORMS];

export const PLATFORM_OPTIONS: { label: string; value: Platform }[] = [
  { label: "Zoom", value: PLATFORMS.ZOOM },
  { label: "Google Meet", value: PLATFORMS.GOOGLE_MEET },
  { label: "Teams", value: PLATFORMS.MICROSOFT_TEAMS },
];

export const DEFAULT_PLATFORM: Platform = PLATFORMS.GOOGLE_MEET;

// Nylas conferencing provider (maps to Nylas API provider string)
export const NYLAS_CONFERENCING_PROVIDER = "Google Meet" as const;

// ─── Meeting Durations (minutes) ────────────────────────────────────────────────
export const MEETING_DURATIONS = [15, 30, 45, 60] as const;

/**
 * Display labels for each entry in {@link MEETING_DURATIONS}. Solid hours
 * read as `"1 hour"`; everything else uses the `"{n} minutes"` pattern.
 * The keyed type is `(typeof MEETING_DURATIONS)[number]`, so adding a new
 * duration to the array forces a matching label here at compile time — no
 * more silent unmapped durations like `{duration === 60 ? ... : ...}`.
 */
export const MEETING_DURATION_LABELS: Record<
  (typeof MEETING_DURATIONS)[number],
  string
> = {
  15: "15 minutes",
  30: "30 minutes",
  45: "45 minutes",
  60: "1 hour",
};

/**
 * Pre-built `<Select>` options derived from
 * {@link MEETING_DURATIONS} + {@link MEETING_DURATION_LABELS}. `value` is
 * a string because Radix Select emits string-typed values; the label is
 * the display string. Drop-in for `app/dashboard/new/page.tsx`:
 *
 *   {MEETING_DURATION_OPTIONS.map(({ label, value }) => (
 *     <SelectItem key={value} value={value}>{label}</SelectItem>
 *   ))}
 */
export const MEETING_DURATION_OPTIONS: ReadonlyArray<{
  readonly label: string;
  readonly value: string;
}> = MEETING_DURATIONS.map((d) => ({
  label: MEETING_DURATION_LABELS[d],
  value: String(d),
}));

// ─── Validation Limits ──────────────────────────────────────────────────────────
export const VALIDATION = {
  NAME_MIN: 3,
  NAME_MAX: 150,
  TITLE_MIN: 3,
  TITLE_MAX: 150,
  URL_MIN: 3,
  URL_MAX: 150,
  DESCRIPTION_MIN: 3,
  DESCRIPTION_MAX: 300,
  DURATION_MIN: 1,
  DURATION_MAX: 100,
  USERNAME_MIN: 3,
  USERNAME_MAX: 150,
} as const;

// ─── File Upload Limits ─────────────────────────────────────────────────────────
export const UPLOAD = {
  MAX_IMAGE_SIZE: "4MB",
} as const;

// ─── Date / Time Formatting ─────────────────────────────────────────────────────
export const LOCALE = "nl-BE" as const;

// ─── Onboarding Grant‑ID Features ───────────────────────────────────────────────
export const GRANT_ID_FEATURE_TEXTS = [
  "Auto-sync availability",
  "Prevent double bookings",
  "Auto timezone conversion",
  "Google Meet integration",
] as const;

// ─── Avatar ─────────────────────────────────────────────────────────────────────
/**
 * Display-string used when the user-avatar circle has neither a usable
 * profile image nor a real `name`/`userName` to render an initial from.
 * Picked because `?` reads as a visual placeholder without colliding with
 * any letter/digit a real username might begin with. Consumed by the
 * sidebar + header avatar bubbles in `app/dashboard/layout.tsx`.
 */
export const AVATAR_FALLBACK_INITIAL = "?" as const;

// ─── Form Field Names ───────────────────────────────────────────────────────────
/**
 * DOM-name surface for `<input name>` and `FormData.get(key)` keys — single
 * source of truth so a future rename (e.g. `fromTime` → `startTime`) is a
 * one-file edit instead of a multi-call-site swap.
 *
 * Composite ids (per-row selectors like `fromTime-${id}`) compose these via
 * template literals at the call site — see {@link parseAvailabilityForm}
 * in `lib/utils.ts` for the canonical parser that uses these.
 *
 * Intentionally EXCLUDES the fully-generic field names (`name`, `email`,
 * `username`): those names are too common across React/HTML/Conform to
 * centralize without colliding with unrelated prop usage; the few call
 * sites that read them from FormData stay explicit `"…"` literals.
 */
export const FORM_FIELDS = {
  ID: "id",
  IS_ACTIVE: "isActive",
  FROM_TIME: "fromTime",
  TILL_TIME: "tillTime",
  EVENT_TYPE_ID: "eventTypeId",
  MEETING_LENGTH: "meetingLength",
  EVENT_DATE: "eventDate",
} as const;

export type FormFieldName = (typeof FORM_FIELDS)[keyof typeof FORM_FIELDS];
