import { Package, PackageStatus } from "../package";

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

export const bodyTemplate = (pkg: Package) => {
  let status: keyof typeof PackageStatus = pkg.status;
  let updatedBy = pkg.createdBy.name;

  const statusTextMap = {
    CREATED: "created",
    MODIFIED: "modified",
    REVIEWED: "reviewed",
    APPROVED: "approved",
  };

  const statusColorMap = {
    CREATED: "#6c757d",
    MODIFIED: "#17a2b8",
    REVIEWED: "#f0ad4e",
    APPROVED: "#28a745",
  };

  return `
    <html>
      <body style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:30px;">
          
          <h2 style="color:#2c7be5; margin-top:0;">
            Package ${statusTextMap[status]} 📦
          </h2>

          <p>Hello,</p>

          <p>
            This package has been 
            <strong style="color:${statusColorMap[status]};">
              ${statusTextMap[status].toUpperCase()}
            </strong> 
            by <strong>${updatedBy}</strong>.
          </p>

          <table style="width:100%; border-collapse:collapse; margin-top:15px;">
            <tr>
              <td style="padding:8px 0; color:#555;"><strong>Package ID</strong></td>
              <td style="padding:8px 0;">#${pkg.id}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#555;"><strong>Description</strong></td>
              <td style="padding:8px 0;">${pkg.description}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#555;"><strong>Status</strong></td>
              <td style="padding:8px 0; color:${statusColorMap[status]};">
                <strong>${status}</strong>
              </td>
            </tr>
          </table>

          <p style="margin-top:25px;">
            If you have any questions, feel free to reply to this email.
          </p>

          <hr style="margin:30px 0; border:none; border-top:1px solid #eee;"/>

          <p style="font-size:12px; color:#888;">
            This is an automated notification email.
          </p>
        </div>
      </body>
    </html>
  `;
};

export const sendEmail = async (
  pkg: Package
) => {
  "use server"
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Missing acess token");

  
  const recipient = pkg.createdBy.email;
  
  console.log("sending email to ", recipient);
  const body = bodyTemplate(pkg);

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
};