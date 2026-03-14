import { Category as PrismaCategory } from "@prisma/client";
import prisma from "./prisma";

export type Category = PrismaCategory;
export type CategoryFormData = {
  name: string
  description: string
}

export const getCategories = async (): Promise<Category[]> => {
  "use server"
  return await prisma.category.findMany({
    where: { name: { not: "Room" } },
    include: {
      _count: { select: { products: true } }
    }
  });
}

export const createNewCategory = async (form: CategoryFormData): Promise<Category> => {
  "use server"
  const category = await prisma.category.create({
    data: {
      name: form.name,
      description: form.description
    }
  })

  return category;
}