import Nylas from "nylas";
import { APP_URL, ROUTES } from "./constants";
import { withScheme } from "./urls";

export const nylasConfig = {
  // OAuth-side configuration (consumed by app/api/auth and app/api/oauth/exchange).
  clientId: process.env.NYLAS_CLIENT_ID,
  // Nylas REQUIRES an absolute `redirect_uri` (HTTPS in prod). Previously
  // this was `${NEXT_PUBLIC_URL ?? ""}${ROUTES.API_OAUTH_EXCHANGE}`, which
  // silently crashed the OAuth handshake when NEXT_PUBLIC_URL was unset
  // (the empty-string fallback yields the malformed relative path
  // `/api/oauth/exchange`). `withScheme` adds the scheme and APP_URL
  // becomes the fallback absolute host — sharing one SSOT surface with
  // `buildBookingUrl` so a future scheme change ripples both at once.
  callbackUri: `${withScheme(process.env.NEXT_PUBLIC_URL ?? APP_URL)}${ROUTES.API_OAUTH_EXCHANGE}`,
  // Server-side SDK configuration (consumed by the Nylas client below).
  apiKey: process.env.NYLAS_API_SECRET_KEY,
  apiUri: process.env.NYLAS_API_URL,
};

// Nylas v8 SDK constructor signature (`NylasConfig`):
//   `{ apiKey: string; apiUri?: string; timeout?: number; headers?: Record<string, string> }`
// Only `apiKey` is required; everything else defaults sensibly (US region, no extra headers).
export const nylas = new Nylas({
  apiKey: nylasConfig.apiKey!,
  apiUri: nylasConfig.apiUri,
});
