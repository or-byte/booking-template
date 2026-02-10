"use server";

import { Room as PrismaRoom, RoomType as PrismaRoomType } from "@prisma/client"
import prisma from "./prisma"

export type Room = PrismaRoom;
export type RoomType = PrismaRoomType;

export const isRoomAvailable = async (roomId: number, checkinDate: Date, checkoutDate: Date) => {
    const conflicts = await prisma.booking.findMany({
        where: {
            roomId,
            status: "CONFIRMED",
            AND: [
                { checkinDate: { lt: checkoutDate } },
                { checkoutDate: { gt: checkinDate } },
            ],
        }
    })

    return conflicts.length > 0;
}

export const getRoomTypes = async () => {
    const roomTypes = await prisma.roomType.findMany();

    return roomTypes.map((rt) => ({
        ...rt,
        price: Number(rt.price)
    }))
}

export const createNewRoom = async (name: string, roomTypeId: number) => {
    return await prisma.room.create({
        data: {
            name: name,
            roomType: { connect: { id: roomTypeId } }
        }
    })
}