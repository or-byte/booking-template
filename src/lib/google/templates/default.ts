import { Package, PackageEvent, PackageEventType } from "~/lib/package";
import { statusColorMap, statusTextMap } from "./status";

export const renderPackageEventsHTML = (events: PackageEvent[]) => {
  const workflow: PackageEventType[] = [
    PackageEventType.CREATED,
    PackageEventType.REVIEWED,
    PackageEventType.APPROVED,
  ];

  const eventMap = new Map(events.map((e) => [e.type, e]));

  return `
    <div style="
      display:flex;
      width:100%;
      align-items:flex-start;
      padding:12px 4px;
    ">
      ${workflow
      .map((type, i) => {
        const e = eventMap.get(type);

        const isFirst = i === 0;
        const isLast = i === workflow.length - 1;

        const isCompleted = !!e;

        const isImportant = type === PackageEventType.REVIEWED ||
          type === PackageEventType.APPROVED;

        return `
            <div style="
              flex:1;
              display:flex;
              align-items:center;
              position:relative;
              min-width:0;
            ">

              ${!isFirst ? `
                <div style="
                  position:absolute;
                  left:0;
                  top:10px;
                  width:50%;
                  height:2px;
                  background:#e5e7eb;
                "></div>
              ` : ""}

              ${!isLast ? `
                <div style="
                  position:absolute;
                  right:0;
                  top:10px;
                  width:50%;
                  height:2px;
                  background:#e5e7eb;
                "></div>
              ` : ""}

              <!-- node -->
              <div style="
                z-index:10;
                display:flex;
                flex-direction:column;
                align-items:center;
                width:100%;
              ">

                <div style="
                  width:20px;
                  height:20px;
                  border-radius:9999px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  border:1px solid ${isCompleted ? "#22c55e" : "#d1d5db"};
                  background:${isCompleted ? "#22c55e" : "#fff"};
                  color:${isCompleted ? "#fff" : "#9ca3af"};
                  font-size:10px;
                ">
                  ${isCompleted ? "✓" : ""}
                </div>

                <div style="text-align:center; margin-top:8px;">

                  <div style="
                    font-size:13px;
                    font-weight:${isImportant ? "700" : "400"};
                    color:#374151;
                  ">
                    ${type}
                  </div>

                  ${e ? `
                    <div style="
                      font-size:12px;
                      color:#6b7280;
                      margin-top:4px;
                    ">
                      ${new Date(e.createdAt).toLocaleString()}<br/>
                      ${e.description}<br/>
                      by ${e.createdBy.name}
                    </div>
                  ` : ""}

                </div>

              </div>
            </div>
          `;
      })
      .join("")}
    </div>
  `;
};

export default function defaultBodyTemplate(pkg: Package) {
  const status = pkg.status;

  const total = (pkg.packageItems ?? []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemsHtml = (pkg.packageItems ?? [])
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

  const eventsHtml = renderPackageEventsHTML(pkg.packageEvents);

  return `
    <html>
      <body style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
        <div style="max-width:full; margin:auto; background:white; border-radius:8px; padding:30px;">
          
          <h2 style="color:#2c7be5; margin-top:0;">
            Package ${statusTextMap[status]} 📦
          </h2>

          <p>Hello,</p>

          <p>
            This package has been 
            <strong style="color:${statusColorMap[status]};">
              ${statusTextMap[status].toUpperCase()}.
            </strong> 
          </p>

          ${eventsHtml}

          <table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <tr>
              <th style="text-align:left; padding:6px 0; border-bottom:1px solid #eee;">Item</th>
              <th style="text-align:left; padding:6px 0; border-bottom:1px solid #eee;">Qty</th>
              <th style="text-align:left; padding:6px 0; border-bottom:1px solid #eee;">Price</th>
              <th style="text-align:left; padding:6px 0; border-bottom:1px solid #eee;">Subtotal</th>
            </tr>

            ${itemsHtml}

            <tr>
              <td colspan="3" style="padding:10px 0; text-align:right; border-top:1px solid #eee;">
                <strong>Total</strong>
              </td>
              <td style="padding:10px 0; border-top:1px solid #eee;">
                <strong>₱${total}</strong>
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