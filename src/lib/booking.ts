"use server";

import { BookingStatus, Booking as PrismaBooking } from "@prisma/client"
import prisma from "./prisma";
import { createNewUser, findUserByEmail } from "./user";
import { isRoomAvailable } from "./room";

export type Booking = PrismaBooking;

export type BookingFormData = {
    customerFullName: string
    customerEmail: string
    roomTypeId: number
    numOfGuests: number
    checkinDate: Date
    checkoutDate: Date
}

function serializeBookings(bookings: Booking[]) {
    return bookings.map((b) => ({
        ...b,
        checkinDate: b.checkinDate.toISOString(),
        checkoutDate: b.checkoutDate.toISOString(),
    }))
}

export const getBookings = async (options?: { status?: BookingStatus; roomId?: number }) => {
    const bookings = await prisma.booking.findMany({
        where: {
            ...(options?.status && { status: options.status }),
            ...(options?.roomId && { roomId: options.roomId }),
        },
        include: {
            room: true,
            customer: true,
            orders: true,
        }
    });

    return serializeBookings(bookings);
}

export const createNewBooking = async (data: BookingFormData) => {
    const room = await prisma.room.findFirst({
        where: { roomTypeId: data.roomTypeId }
    })

    if (!room) throw new Error("Room not found");

    const conflict = await isRoomAvailable(room.id, new Date(data.checkinDate), new Date(data.checkoutDate));

    if (conflict) throw new Error("No room available")

    let customer = await findUserByEmail(data.customerEmail);

    if (!customer) {
        customer = await createNewUser(data.customerEmail, data.customerFullName, "CUSTOMER")
    }

    const booking = await prisma.booking.create({
        data: {
            room: { connect: { id: room.id } },
            customer: { connect: { id: customer.id } },
            numOfGuests: data.numOfGuests,
            checkinDate: data.checkinDate,
            checkoutDate: data.checkoutDate,  
            status: "PENDING"   
        }
    })

    return booking;
}