
import { getPackageById } from "../package";
import { getUserEmailsByRole, Role } from "../user";
import defaultBodyTemplate from "./templates/default";

let gCachedToken: string | null = null;
let gTokenExpiry = 0;

export type ContactUsRequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

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

// returns response.json() from Gmail API v1
export const sendContactUsEmail = async (requestBody: ContactUsRequestBody) : Promise<any> => {
  "use server"

  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Missing access token");

  const recipient = process.env.CONTACT_US_RECIPIENT_EMAIL;
  const subject = `${requestBody.subject} - ${requestBody.email}`;
  const body = `${requestBody.firstName} ${requestBody.lastName} says: ${requestBody.message}`;

  const message = [
    `To: ${recipient}`,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=UTF-8",
    "",
    body
  ].join("\n");

  const base64Encoded = Buffer.from(message, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  
  const results = [];

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

  return results;
}

// returns response.json() from Gmail API v1
export const sendEmail = async (packageId: number) : Promise<any> => {
  "use server"

  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Missing access token");

  const pkg = await getPackageById(packageId);

  const admins = await getUserEmailsByRole(Role.ADMIN);
  const recipients = [
    ...admins,
    ...(admins.includes(pkg.contactEmail) ? [] : [pkg.contactEmail]),
  ];

  const results = [];

  for (const recipient of recipients) {
    const body = defaultBodyTemplate(pkg);

    const message = [
      `To: ${recipient}`,
      `Subject: The Waterfront Beach Resort Package Update`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      body,
    ].join("\n");

    const base64Encoded = Buffer.from(message, "utf-8")
      .toString("base64")
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

      results.push(await response.json());
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  return results;
};