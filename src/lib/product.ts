import { Product as PrismaProduct } from "@prisma/client"
import { Image as PrismaImage } from "@prisma/client"
import prisma from "./prisma";
import { query } from "@solidjs/router";

export type Image = PrismaImage;

export type Product = Omit<PrismaProduct, "price"> & { price: number, images: Image[] };

export type ProductPreview = Omit<Product, "images"> & { previewUrl?: string };

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

// when calling this function, by default, all images are called by default
// by switching `previewOnly` to true, images are omitted and only the first image as `previewUrl` is assigned
//
// creating resource from this function also defaults it to Product[], otherwise it is required to declare it as ProductPreview[]
// example: const [rooms] = createResource(async () => { return await getProductsByCategoryName("Room", true) as ProductPreview[] });
export const getProductsByCategoryName = query(
  async (name: string, previewOnly: boolean = false): Promise<Product[] | ProductPreview[]> => {
    "use server"

    const products = await prisma.product.findMany({
      where: { category: { name } },
      include: {
        images: true
      }
    });

    if (previewOnly) return products.map(mapProductPreview) as ProductPreview[];

    return products.map(mapProduct) as Product[];
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
    images: product.images
  };
}

// this function maps to ProductPreview where only the first image is returned to frontend
// previewUrl is nullable, frontend should handle empty preview
export function mapProductPreview(product: any): ProductPreview {
  return {
    ...product,
    price: product.price.toNumber(),
    previewUrl: product.images[0]?.url
  }
}