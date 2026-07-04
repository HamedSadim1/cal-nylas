import { auth } from "@/auth";
import prisma from "@/lib/db";

import { nylas, nylasConfig } from "@/lib/nylas";

import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { ROUTES } from "@/lib/constants";

export async function GET(req: NextRequest) {
  console.log("Received callback from Nylas");
  const session = await auth();
  if (!session?.user) {
    return Response.json("No user signed in", {
      status: 401,
    });
  }
  const url = req.nextUrl;
  console.log("🚀 ~ GET ~ url:", url);
  const code = url.searchParams.get("code");
  console.log("🚀 ~ GET ~ code:", code);

  if (!code) {
    return Response.json("No authorization code returned from Nylas", {
      status: 400,
    });
  }
  if (!nylasConfig.clientId) {
    return Response.json("NYLAS_CLIENT_ID is not configured", { status: 500 });
  }

  const codeExchangePayload = {
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId,
    redirectUri: nylasConfig.callbackUri,
    code,
  };

  try {
    const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
    console.log("🚀 ~ GET ~ response:", response);
    const { grantId, email } = response;

    if (!session?.user?.id) {
      return Response.json("No user ID in session", { status: 401 });
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        grantId: grantId,
        grantEmail: email,
      },
    });

    console.log({ grantId });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
  }

  redirect(ROUTES.DASHBOARD);
}
