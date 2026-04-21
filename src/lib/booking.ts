import { Booking as PrismaBooking } from "@prisma/client";
import prisma from "./prisma";
import { query } from "@solidjs/router";
import { PackageItem } from "./package";
import { getUserByEmail } from "./user";

// Mirrors booking status enum from schema
export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CHECKEDIN: "CHECKEDIN",
  NOSHOW: "NOSHOW",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED"
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export type Booking = PrismaBooking & {
  checkInDate: Date
  checkOutDate: Date
  leadGuestName: string
  roomName: string
  status: BookingStatus
}

export type BookingFormData = {
  productId: number
  checkInDate: Date
  checkOutDate: Date
  status: BookingStatus
}

export type BookingCreateResponse = {
  bookingId?: number | null;
  roomId: number | null;
}

export type BookingUpdateResponse = {
  id: number
  leadGuestId: string
  roomId: number
  status: BookingStatus
}

export const getAllBookings = query(
  async (): Promise<Booking[]> => {
    "use server"

    const result = await prisma.$queryRaw<{ id: string, leadGuestId: string, roomId: number, datetimeRange: string, leadGuestName: string, roomName: string }[]>`
      SELECT
        b."id",
        b."leadGuestId",
        b."roomId",
        b."datetimeRange"::"text",
        b."status",
        u."name" as "leadGuestName",
        r."name" as "roomName"
      FROM "Booking" b
      JOIN "User" u ON u.id = b."leadGuestId"
      JOIN "Room" r ON r.id = b."roomId"
      ORDER BY b."id" ASC
    `;

    const bookings = result.map(b => {
      return mapBooking(b);
    });

    return bookings;
  },
  "get-all-bookings"
)

export const createNewBooking = async (email: string, forms: BookingFormData[]): Promise<BookingCreateResponse[]> => {
  "use server";

  if (!forms.length) return [];

  const user = await getUserByEmail(email);

  if (!user) throw new Error("User not found");

  const results: { bookingId: number | null; roomId: number | null }[] = [];

  // Get all available rooms for these products in one query
  const productIds = Array.from(new Set(forms.map(f => f.productId))); // unique product IDs

  // This is a safety check to make sure that each booking aligns to the same Package `eventTime` and `durationInDays`
  const [first] = forms;

  const sameDates = forms.every(
    f =>
      f.checkInDate.getTime() === first.checkInDate.getTime() &&
      f.checkOutDate.getTime() === first.checkOutDate.getTime()
  );

  if (!sameDates) {
    throw new Error("All booking forms must have the same date range");
  }

  const availableRooms = await prisma.$queryRaw<{ productId: number; roomId: bigint }[]>`
    SELECT r."productId", r."id" as "roomId"
    FROM "Room" r
    WHERE r."productId" = ANY(${productIds})
      AND NOT EXISTS (
        SELECT 1
        FROM "Booking" b
        WHERE b."roomId" = r."id"
          AND b."datetimeRange" && tstzrange(
            ${first.checkInDate}::timestamptz,
            ${first.checkOutDate}::timestamptz,
            '[)'
          )
      )
    ORDER BY r."id"
  `;

  // Assign rooms to each form
  const bookingsToInsert: {
    leadGuestId: string
    roomId: number
    checkInDate: Date
    checkOutDate: Date
    status: BookingStatus
  }[] = [];

  for (const form of forms) {
    const roomIndex = availableRooms.findIndex(r => r.productId === form.productId);
    if (roomIndex === -1) {
      results.push({ bookingId: null, roomId: null }); // no room available
      continue;
    }

    const room = availableRooms.splice(roomIndex, 1)[0]; // assign & remove to prevent double-booking
    bookingsToInsert.push({
      leadGuestId: user.id,
      roomId: Number(room.roomId),
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
      status: form.status,
    });
  }

  if (bookingsToInsert.length) {
    const values = bookingsToInsert
      .map(
        b =>
          `('${b.leadGuestId}', ${b.roomId}, tstzrange('${b.checkInDate.toISOString()}', '${b.checkOutDate.toISOString()}', '[)'), '${b.status}')`
      )
      .join(", ");

    const inserted = await prisma.$queryRawUnsafe<{ id: bigint; roomId: bigint }[]>(
      `
        INSERT INTO "Booking" 
          ("leadGuestId", "roomId", "datetimeRange", "status")
        VALUES ${values}
        RETURNING "id", "roomId"`
    );

    for (let i = 0; i < inserted.length; i++) {
      results.push({
        bookingId: Number(inserted[i].id),
        roomId: Number(inserted[i].roomId),
      });
    }
  }

  return results;
};

export const updateBookingStatus = async (id: number, status: BookingStatus): Promise<BookingUpdateResponse> => {
  "use server"

  const result = await prisma.booking.update({
    where: { id },
    data: { status }
  });

  return result;
}

export function mapBooking(booking: any): Booking {
  const times = booking.datetimeRange.split(",");

  const checkInDate = new Date(times[0].replace(/[\[\("]/g, "").replace(/"/g, ""));
  const checkOutDate = new Date(times[1].replace(/[\]\)"]/g, "").trim());

  const { datetimeRange, ...rest } = booking;

  return {
    ...rest,
    checkInDate,
    checkOutDate,
  }
}