import { Category as PrismaCategory } from "@prisma/client";
import prisma from "./prisma";

// Explicitly added count as field in Category to surpass unrecognizable error for _count
export type Category = PrismaCategory & { count?: number };

export type CategoryFormData = {
  name: string
  description: string
}

/// getCategories fetches all except Room
// Room is a category but it is used separately
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