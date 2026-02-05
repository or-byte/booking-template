import { Product as PrismaProduct } from "@prisma/client"
import { query } from "@solidjs/router";
import prisma from "./prisma";

export type Product = PrismaProduct;

export const getProductsByCategory = query(async (id: number) => {
    "use server";
    const products = await prisma.product.findMany({ where: { categoryId: id } });

    return products.map(p => ({
        ...p,
        price: p.price.toNumber(),
    }));
}, "productsCategory");