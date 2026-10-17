/** Whether the online booking UI is shown. Set at build time in app.config.ts. */
export const bookingEnabled = import.meta.env.VITE_BOOKING_ENABLED === "true";

/** Where booking calls to action lead while online booking is switched off. */
export const bookingFallbackHref = "/contact?booking=soon";

/** Destination for "Book now" style buttons in either mode. */
export const bookHref = bookingEnabled ? "/rooms" : bookingFallbackHref;
