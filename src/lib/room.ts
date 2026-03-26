import { Room as PrismaRoom } from "@prisma/client";
import prisma from "./prisma";
import { query, RouteMatch } from "@solidjs/router";

export type RoomDto = PrismaRoom;

export const getAllRooms = query(
  async () : Promise<RoomDto[]> => {
    "use server"

    return prisma.room.findMany({});
  },
  "get-all-rooms"
)