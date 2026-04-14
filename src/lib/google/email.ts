import { Role } from "@prisma/client";
import { Package } from "../package";
import { getUserEmailsByRole } from "../user";
import defaultBodyTemplate from "./templates/default";

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

export const sendEmail = async (
  pkg: Package
) => {
  "use server"

  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Missing acess token");

  const admins = await getUserEmailsByRole(Role.ADMIN);
  const recipients: string[] = [
    ...admins,
    ...(admins.includes(pkg.contactEmail) ? [] : [pkg.contactEmail]), // this is to prevent duplication
  ];

  for (let i: number = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    console.log("sending email to ", recipient);

    const body = defaultBodyTemplate(pkg);

    const message = [
      `To: ${recipient}`,
      `Subject: The Waterfront Beach Resort Package Update`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      body
    ].join("\n");

    const base64Encoded = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

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

      return await response.json();
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
};