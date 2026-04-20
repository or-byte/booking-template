import { Product as PrismaProduct } from "@prisma/client"
import { Image as PrismaImage } from "@prisma/client"
import prisma from "./prisma";
import { query } from "@solidjs/router";

const placeholderProductImage = "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=";

export type Image = PrismaImage;

export type Product = Omit<PrismaProduct, "price"> & { price: number, images: Image[] };

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export type EditableProduct = Partial<Product> & { id?: number; categoryId?: number }

export type ProductRoomsRequestCounter = {
  deluxe: number
  superior: number
  standard: number
  loft: number
  dormOld: number
  dormNew: number
}

export const getAllProducts = query(
  async (): Promise<Product[]> => {
    "use server"

    const products = await prisma.product.findMany({
      include: {
        images: true
      }
    });

    return products.map(mapProduct);
  },
  "all-products"
);

export const getProductsByCategory = query(
  async (id: number): Promise<Product[]> => {
    "use server"

    const products = await prisma.product.findMany({
      where: { categoryId: id },
      include: {
        images: true
      }
    });

    return products.map(mapProduct);
  },
  "products-by-category-id"
);


export const getProductsByCategoryName = query(
  async (name: string): Promise<Product[]> => {
    "use server"

    const products = await prisma.product.findMany({
      where: { category: { name: name } },
       include: {
         images: true 
        }
    });

    return products.map(mapProduct);
  },
  "products-by-category-name"
);

export const createNewProduct = async (form: ProductFormData): Promise<Product> => {
  "use server"

  const product = await prisma.product.create({
    data: {
      name: form.name,
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

export function mapProduct(product: any): Product {
  return {
    ...product,
    price: product.price.toNumber(),
    images: product.images.length !== 0 ? product.images : [{ id: 9999, title: "Placeholder Image", url: placeholderProductImage, productId: product.id  }]
  };
}