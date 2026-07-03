import { nylas, nylasConfig } from "@/lib/nylas";
import { redirect } from "next/navigation";

export async function GET() {
  if (!nylasConfig.clientId) {
    throw new Error("NYLAS_CLIENT_ID is not configured");
  }
  const authUrl = nylas.auth.urlForOAuth2({
    clientId: nylasConfig.clientId,
    redirectUri: nylasConfig.callbackUri,
  });
  return redirect(authUrl);
}
