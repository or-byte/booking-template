import { defineConfig } from "@solidjs/start/config";

/*
 * Online booking is not built yet. Production (the live customer site) hides
 * the booking UI and routes guests to the contact page instead; previews keep
 * the full demo so the client can review the flow. BOOKING_ENABLED overrides
 * either way ("true" / "false"), e.g. for local testing.
 */
const bookingEnabled =
  process.env.BOOKING_ENABLED ?? (process.env.VERCEL_ENV === "production" ? "false" : "true");

export default defineConfig({
  vite: {
    define: {
      "import.meta.env.VITE_BOOKING_ENABLED": JSON.stringify(bookingEnabled),
    },
  },
});
