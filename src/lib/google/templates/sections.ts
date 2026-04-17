import { Package, PackageEvent } from "~/lib/package";

export const renderItemsHTML = (pkg: Package) => {
  return (pkg.packageItems ?? [])
    .map(
      (item) => `
        <tr>
          <td style="padding:6px 0; color:#555;">${item.name}</td>
          <td style="padding:6px 0;">${item.quantity}</td>
          <td style="padding:6px 0;">₱${item.price}</td>
          <td style="padding:6px 0;">₱${item.price * item.quantity}</td>
        </tr>
      `
    )
    .join("");
}

export const renderPackageEventsHTML = (events: PackageEvent[], isAdmin = false) => {
  const getColor = (type: string) =>
    type === "REJECTED" || type === "CANCELLED" ? "#ef4444" : "#22c55e";

  return `
    <table role="presentation" style="width:100%; border-collapse:collapse;">
      ${events
      .map((e, i) => {
        const color = getColor(e.type);

        const isLast = i === events.length - 1;

        return `
            <tr>
              <!-- LINE COLUMN -->
              <td style="width:30px; vertical-align:top; text-align:center;">
                
                <div style="
                  width:2px;
                  background:#e5e7eb;
                  margin:0 auto;
                  height:100%;
                  ${isLast ? "visibility:hidden;" : ""}
                "></div>

              </td>

              <!-- CONTENT COLUMN -->
              <td style="padding:10px 0; vertical-align:top;">
                
                <!-- ICON -->
                <div style="
                  width:20px;
                  height:20px;
                  border-radius:50%;
                  background:${color};
                  color:#fff;
                  text-align:center;
                  line-height:20px;
                  font-size:10px;
                  margin-left:-11px;
                  position:relative;
                  z-index:2;
                ">
                  ✓
                </div>

                <!-- CONTENT -->
                <div style="margin-left:20px;">
                  <div style="font-size:12px;color:#6b7280;">
                    ${new Date(e.createdAt).toLocaleString()}
                  </div>

                  <div style="font-weight:600;">
                    ${e.type}
                  </div>

                  <div style="font-size:12px;color:#4b5563;">
                    ${e.description}
                  </div>
                </div>

              </td>
            </tr>
          `;
      })
      .join("")}
    </table>
  `;
};