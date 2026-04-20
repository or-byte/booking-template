import crypto from "crypto";

//the object format for start and end field is required for google api 
export type EventFormData = {
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
};

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const createJWT = async (client_email: string, private_key: string): Promise<any> => {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: client_email,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));

  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(data)
    .sign(private_key, "base64");

  const encodedSignature = signature
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${data}.${encodedSignature}`;
}

export const getServiceAccountAccessToken = async (): Promise<any> => {
  "use server";
  const privateKey = process.env.SERVICE_ACCOUNT_KEY!
    .replace(/\\n/g, "\n")
    .trim();
  const jwt = await createJWT(
    process.env.SERVICE_ACCOUNT_EMAIL!,
    privateKey!
  );

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await res.json();

  return data.access_token;
}

export const listEvents = async (accessToken: string): Promise<any> => {
  "use server";
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${process.env.GOOGLE_CALENDAR_ID}/events`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.json();
}

export const createEvent = async (accessToken: string, body: EventFormData): Promise<any> => {
  "use server";

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${process.env.GOOGLE_CALENDAR_ID}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  return res.json();
}

export const deleteEvent = async (accessToken: string, eventId: string): Promise<any> => {
  "use server";
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${process.env.GOOGLE_CALENDAR_ID}/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (res.status === 204) return { success: true };
  return res.json();
}