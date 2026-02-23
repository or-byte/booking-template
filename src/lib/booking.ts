import { BookingStatus, Booking as PrismaBooking } from "@prisma/client"
import { createNewUser, findUserByEmail } from "./user";
import { getAvailableRoom } from "./room";
import prisma from "./prisma";

export type Booking = PrismaBooking;

export type BookingFormData = {
    productId: number
    customerFullName: string
    customerEmail: string
    numOfGuests: number
    checkIn: Date
    checkOut: Date
    status: BookingStatus
}

export const createNewBooking = async (form: BookingFormData) : Promise<{id: string, customerId: number, roomId: number, numOfGuests: number, status: BookingStatus}> => {
    "use server"
    const start = new Date(form.checkIn);
    start.setHours(12);
    const end = new Date(form.checkOut);
    end.setHours(14);

    let customer = await findUserByEmail(form.customerEmail);

    if (!customer) {
        customer = await createNewUser(form.customerEmail, form.customerFullName, "CUSTOMER")
    }

    const room = await getAvailableRoom(form.productId, start, end);

    const result = await prisma.$queryRaw`
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
    `

    return result;
}