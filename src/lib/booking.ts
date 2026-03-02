import { BookingStatus, Booking as PrismaBooking } from "@prisma/client"
import { createNewUser, findUserByEmail } from "./user";
import { getAvailableRoom } from "./room";
import prisma from "./prisma";

export type Booking = PrismaBooking & { checkInRange: string };

export type BookingWithCustomer = Booking & { customer: { fullName: string, email: string }}

export type BookingFormData = {
    productId: number
    customerFullName: string
    customerEmail: string
    numOfGuests: number
    checkIn: Date
    checkOut: Date
    status: BookingStatus
}

export const getAllFutureBookings = async (): Promise<BookingWithCustomer[]> => {
    "use server"
    const today = new Date();
    today.setHours(0, 0, 0, 0)

    const result = await prisma.$queryRaw<BookingWithCustomer[]>
        `
            SELECT
                b."id",
                b."roomId",
                b."customerId",
                b."numOfGuests",
                b."status",
                b."checkInRange"::text,
                json_build_object(
                    'fullName', u."fullName",
                    'email', u."email"
                ) AS customer
            FROM "Booking" b
            JOIN "User" u ON u.id = b."customerId"
            WHERE lower(b."checkInRange") >= ${today}::timestamptz
                AND b."status" = 'CONFIRMED'::"BookingStatus"
            ORDER BY lower(b."checkInRange") ASC
        `;

    return result;
}

export const createNewBooking = async (form: BookingFormData): Promise<{
    id: string
    customerId: number
    roomId: number
    numOfGuests: number
    status: BookingStatus
}> => {
    "use server"

    const start = new Date(form.checkIn)
    start.setHours(12)

    const end = new Date(form.checkOut)
    end.setHours(14)

    let customer = await findUserByEmail(form.customerEmail)

    if (!customer) {
        customer = await createNewUser(
            form.customerEmail,
            form.customerFullName,
            "CUSTOMER"
        )
    }

    const room = await getAvailableRoom(form.productId, start, end)

    if (!room) {
        throw new Error("No available room found")
    }

    const result = await prisma.$queryRaw<{ id: string, customerId: number, roomId: number, numOfGuests: number, status: BookingStatus }[]>
        `
            INSERT INTO "Booking" 
                ("customerId", "roomId", "numOfGuests", "checkInRange", "status")
            VALUES
                (
                    ${customer.id},
                    ${room.id},
                    ${form.numOfGuests},
                    tstzrange(
                        ${start}::timestamptz,
                        ${end}::timestamptz,
                        '[)'
                    ),
                    ${form.status}::"BookingStatus"
                )
            RETURNING 
                "id",
                "customerId",
                "roomId",
                "numOfGuests",
                "status"
        `;

    if (!result.length) {
        throw new Error("Failed returning response in createNewBooking")
    }

    return result[0]
}