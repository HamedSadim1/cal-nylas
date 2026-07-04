import Nylas from "nylas";
import { ROUTES } from "./constants";

export const nylasConfig = {
  // OAuth-side configuration (consumed by app/api/auth and app/api/oauth/exchange).
  clientId: process.env.NYLAS_CLIENT_ID,
  callbackUri:
    (process.env.NEXT_PUBLIC_URL ?? "") + ROUTES.API_OAUTH_EXCHANGE,
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
