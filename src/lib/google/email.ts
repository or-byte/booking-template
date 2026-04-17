import { Role } from "@prisma/client";
import { NormalizedPackage, Package } from "../package";
import { getUserEmailsByRole } from "../user";
import defaultBodyTemplate from "./templates/default";
import { toBase64Url } from "~/utils/buffer";

let gCachedToken: string | null = null;
let gTokenExpiry = 0;

export async function getAccessToken() {
  "use server"
  const now = Date.now();

  if (gCachedToken && now < gTokenExpiry) {
    return gCachedToken;
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Google OAuth error: ", text);
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();

  gCachedToken = data.access_token;
  gTokenExpiry = now + data.expires_in * 1000 - 60000;

  return gCachedToken;
}

// pkg.PackageEvents.length is never 0 because `Package` is created with PackageEvent.type 'CREATED'
export const normalizePkg = (pkg: Package): NormalizedPackage => {
  return {
    ...pkg,
    status: pkg.packageEvents?.[0]?.type!,
  };
};

export const sendEmail = async (pkg: Package) => {
  "use server"

  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Missing access token");

  const normalizedPkg = normalizePkg(pkg);

  const admins = await getUserEmailsByRole(Role.ADMIN);
  const recipients = [
    ...admins,
    ...(admins.includes(normalizedPkg.contactEmail) ? [] : [normalizedPkg.contactEmail]),
  ];

  const results = [];

  for (const recipient of recipients) {
    const body = defaultBodyTemplate(normalizedPkg);

    const message = [
      `To: ${recipient}`,
      `Subject: The Waterfront Beach Resort Package Update`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      body,
    ].join("\n");

    const base64Encoded = toBase64Url(message);

    try {
      const response = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw: base64Encoded }),
        }
      );

      results.push(await response.json());
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  return results;
};