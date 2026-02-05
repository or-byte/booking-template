import { Category as PrismaCategory} from "@prisma/client";
import prisma from "./prisma";

export type Category = PrismaCategory;

export const getCategories = async () => {
    return await prisma.category.findMany();
}