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

    return products.map(p => ({
        ...p,
        price: p.price.toNumber()
    }))
}

export const getProductsByCategory = async (id: number): Promise<Product[]> => {
    "use server";
    const products = await prisma.product.findMany({ where: { categoryId: id } });

    return products.map(p => ({
        ...p,
        price: p.price.toNumber(),
    }));
};