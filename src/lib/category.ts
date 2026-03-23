import { Prisma, Category as PrismaCategory } from "@prisma/client";
import prisma from "./prisma";

export type Category = PrismaCategory & { count?: number };

export type CategoryFormData = {
  name: string
  description: string
}

export const getCategories = async (): Promise<Category[]> => {
  "use server"
  const categories = await prisma.category.findMany({
    where: { name: { not: "Room" } },
    include: {
      _count: { select: { products: true } }
    }
  });

  return categories.map(mapCategory);
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

export function mapCategory(category: PrismaCategory) : Category {
  return {
    ...category,
    count: category._count
  };
}