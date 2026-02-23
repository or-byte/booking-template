import { Order as PrismaOrder } from "@prisma/client"
import prisma from "./prisma";

export type Order = Omit<PrismaOrder, "total" | "amountPaid" | "change" > & {
    total: number
    amountPaid: number
    change: number
};

export type OrderFormData = {
    items: {
        productId: number;
        quantity: number;
    }[];
    total: number;
    amountPaid: number;
}

export const createOrder = async (data: OrderFormData): Promise<Order> => {
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

    return {
        ...order,
        total: order.total.toNumber(),
        amountPaid: order.amountPaid.toNumber(),
        change: order.change.toNumber()
    };
}