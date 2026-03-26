import { User as PrismaUser } from "@prisma/client"
import { query } from "@solidjs/router";
import prisma from "./prisma";

// This mirrors `Role` enum from schema
export const Role = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
} as const;
export type Role = (typeof Role)[keyof typeof Role]

export type User = PrismaUser;

export const getUserEmailsByRole = query(async (role: Role): Promise<string[]> => {
  "use server"

  const results = await prisma.user.findMany({
    where: { role },
    select: {
      email: true
    }
  })

  const emails = results.map((e) => {
    return e.email;
  })

  return emails;
},
  "get-user-emails-by-role"
);

export const getUserByEmail = query(async (email: string): Promise<User> => {
  "use server"

  const result = await prisma.user.findFirst({
    where: { email }
  })

  if (!result) {
    const newUser = await prisma.user.create({
      data: {
        email,
        name: email
      }
    })

    return newUser;
  }

  return result;
},
  "get-user-by-email"
)