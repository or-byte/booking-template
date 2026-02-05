import { Order as PrismaOrder } from "@prisma/client"
import { action } from "@solidjs/router";
import prisma from "./prisma";

export type Order = PrismaOrder;

export const createOrder = action(async (formData: FormData) => {
    "use server";
    const items = JSON.parse(formData.get("items") as string);

    const order = await prisma.order.create({
        data: {
            subtotal: Number(formData.get("subtotal")),
            tax: Number(formData.get("tax")),
            total: Number(formData.get("total")),
            amountPaid: Number(formData.get("amountPaid")),
            change: Number(formData.get("change")),
            paymentMethod: formData.get("paymentMethod") as any,
            orderItems: {
                create: items.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            },
        },
    });

    console.log("Order created!")
    return;
})