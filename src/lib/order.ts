"use server"

import { Order as PrismaOrder } from "@prisma/client"
import prisma from "./prisma";

export type Order = PrismaOrder;

export type OrderFormData = {
    items: {
        productId: number;
        quantity: number;
    }[];
    total: number;
    amountPaid: number;
}

export const createOrder = async (data: OrderFormData) => {
    const tax = data.total * 0.12;
    const subtotal = data.total - tax;
    const change = data.amountPaid - data.total;

    const order = await prisma.order.create({
        data: {
            subtotal: subtotal,
            tax: tax,
            total: data.total,
            amountPaid: data.amountPaid,
            change: change,
            orderItems: {
                create: data.items.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            },
        },
    });

    console.log("Order created!")
    return;
}