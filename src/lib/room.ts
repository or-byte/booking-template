import { Room as PrismaRoom, } from "@prisma/client"
import prisma from "./prisma"

export type Room = PrismaRoom;
export type RoomFormData = {
    name: string
    capacity: number
    productId: number
}

export const getAllRooms = async () : Promise<Room[]> => {
    "use server"
    return await prisma.room.findMany();
}

export const getAllRoomTypes = async () => {
    "use server"
    const roomTypes = await prisma.product.findMany({
        where: {
            category: { name: "Room" }
        }
    }
    );

    return roomTypes.map(rt => ({
        ...rt,
        price: Number(rt.price)
    }));
}

export const getAvailableRoom = async (productId: number, checkIn: Date, checkOut: Date) : Promise<{id: number}> => {
    "use server"
    const rooms = await prisma.$queryRaw<{ id: number }[]>`
        SELECT r.id
        FROM "Room" r
        WHERE r."productId" = ${productId}
            AND NOT EXISTS (
                SELECT 1
                FROM "Booking" b
                WHERE b."roomId" = r.id
                    AND b."checkInRange" && tstzrange(${checkIn}, ${checkOut}, '[)')
            )
        LIMIT 1;
    `

    if (Array.isArray(rooms)) return rooms[0];

    throw new Error("Failed to return response when checking available room");
}

export const createNewRoom = async (form: RoomFormData) : Promise<Room> => {
    "use server"
    return await prisma.room.create({
        data: {
            name: form.name,
            capacity: form.capacity,
            product: { connect: { id: form.productId } }
        }
    })
}
