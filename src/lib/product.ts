import { Product as PrismaProduct } from "@prisma/client"
import prisma from "./prisma";

export type Product = Omit<PrismaProduct, "price"> & { price: number };

export type ProductFormData = {
  sku: string;
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export type EditableProduct = Partial<Product> & { id?: number; categoryId?: number }

export const getAllProducts = async (): Promise<Product[]> => {
  "use server"

  const products = await prisma.product.findMany({
    where: {
      category: {
        name: {
          not: "Room",
        },
      },
    },
  });

  return products.map(mapProduct);
}

export const getProductsByCategory = async (id: number): Promise<Product[]> => {
  "use server"

  const products = await prisma.product.findMany({ where: { categoryId: id } });

  return products.map(mapProduct);
};

export const createNewProduct = async (form: ProductFormData): Promise<Product> => {
  "use server"

  const product = await prisma.product.create({
    data: {
      name: form.name,
      sku: form.sku,
      description: form.description,
      price: form.price,
      categoryId: form.categoryId,
    }
  });
  return mapProduct(product);
}

export const updateProduct = async (form: ProductFormData & { id: number }): Promise<Product> => {
  "use server"

  const product = await prisma.product.update({
    where: { id: form.id },
    data: {
      name: form.name,
      sku: form.sku,
      description: form.description,
      price: form.price,
      categoryId: form.categoryId,
    },
  });

  return mapProduct(product);
};

export const deleteProduct = async (id: number) => {
  "use server"

  await prisma.product.delete({ where: { id } });
};

export function mapProduct(product: PrismaProduct): Product {
  return {
    ...product,
    price: product.price.toNumber()
  };
}