import { Product as PrismaProduct } from "@prisma/client"
import { query } from "@solidjs/router";
import prisma from "./prisma";

export type Product = Omit<PrismaProduct, "price"> & { price: number };
export type ProductFormData = {
    sku: string;
    name: string;
    description: string;
    price: number;
    categoryId: number;
}

export const getProductsByCategory = async (id: number): Promise<Product[]> => {
    "use server";
    const products = await prisma.product.findMany({ where: { categoryId: id} });

    return products.map(p => ({
        ...p,
        price: p.price.toNumber(),
    }));
};

export const createNewProduct = async (form: ProductFormData): Promise<Product> => {
    "use server";
    const product = await prisma.product.create({
        data: {
            name: form.name,
            sku: form.sku,
            description: form.description,
            price: form.price,
            categoryId: form.categoryId,
        }
    });
    return {
        ...product,
        price: product.price.toNumber(),
    }
}