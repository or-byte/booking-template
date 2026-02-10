"use server";

import { User as PrismaUser, Role } from "@prisma/client"
import prisma from "./prisma";

export type User = PrismaUser;

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email }
    });
};

export const createNewUser = async (email: string, fullName: string, role: Role) => {
    const customer = await prisma.user.create({
        data: {
            fullName: fullName,
            email: email,
            role: role,
        }
    });
    return customer;
};