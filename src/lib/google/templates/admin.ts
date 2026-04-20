import { Package } from "~/lib/package";
import { statusColorMap, statusTextMap } from "./status";
import { renderItemsHTML, renderPackageEventsHTML } from "./sections";

export default function adminBodyDefault(pkg: Package) {
  // packageEvents will never be empty because it is created alongside package
  const status = pkg.packageEvents[0].type;

  const total = (pkg.packageItems ?? []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemsHtml = renderItemsHTML(pkg);

  const eventsHtml = renderPackageEventsHTML(pkg.packageEvents, true);

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
              ${statusTextMap[status]}.
            </strong> 
          </p>

          ${eventsHtml}

          <h3 style="margin-top:20px;">Package Details</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td><strong>Company</strong></td><td>${pkg.companyName ?? "-"}</td></tr>
            <tr><td><strong>Email</strong></td><td>${pkg.contactEmail ?? "-"}</td></tr>
            <tr><td><strong>Contact</strong></td><td>${pkg.contactNumber ?? "-"}</td></tr>
            <tr><td><strong>Guests</strong></td><td>${pkg.numberOfGuests}</td></tr>
            <tr><td><strong>Event Date</strong></td><td>${new Date(pkg.eventDate).toLocaleString()}</td></tr>
            <tr><td><strong>Reservation Date</strong></td><td>${pkg.reservationDate ? new Date(pkg.reservationDate).toLocaleString() : "-"}</td></tr>
            <tr><td><strong>Description</strong></td><td>${pkg.description}</td></tr>
          </table>

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