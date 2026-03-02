import { OrderStatus, OrderItem as PrismaOrderItem, Order as PrismaOrder } from "@prisma/client"
import prisma from "./prisma";

export type OrderItem = PrismaOrderItem;

export type Order = Omit<PrismaOrder, "subtotal" | "total" | "amountPaid" | "change"> & {
    subtotal: number;
    total: number;
    amountPaid: number;
    change: number;
};

export type OrderFormData = {
    items: {
        productId: number;
        quantity: number;
    }[];
    total: number;
    amountPaid: number;
    bookingId?: number,
}
export const getOrderByBooking = async (bookingId: number) => {
    "use server"
    const order = await prisma.order.findFirst({
        where: { bookingId },
        include: {
            orderItems: { include: { product: true } },
        },
    })

    if (!order) return null

    return {
        id: order.id,
        createdAt: order.createdAt.toISOString(),
        customerId: order.customerId,
        bookingId: order.bookingId,
        subtotal: order.subtotal.toNumber(),
        tax: order.tax.toNumber(),
        total: order.total.toNumber(),
        amountPaid: order.amountPaid.toNumber(),
        change: order.change.toNumber(),
        status: order.status,
        paymentMethod: order.paymentMethod,
        items: order.orderItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            orderId: item.orderId,
            product: {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price.toNumber(),
            },
        })),
    }
}

export const createOrAppendOrder = async (data: OrderFormData) => {
    "use server"
    const tax = data.total * 0.12
    const subtotal = data.total - tax
    const change = data.amountPaid - data.total

    try {
        const existingOrder = await prisma.order.findFirst({
            where: { bookingId: data.bookingId },
            include: { orderItems: { include: { product: true } } },
        })

        if (existingOrder) {
            // Append new items to the existing order
            const updatedOrder = await prisma.order.update({
                where: { id: existingOrder.id },
                data: {
                    subtotal,
                    tax,
                    total: data.total,
                    amountPaid: data.amountPaid,
                    change,
                    orderItems: {
                        create: data.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    },
                },
                include: { orderItems: { include: { product: true } } },
            })

            return {
                id: updatedOrder.id,
                createdAt: updatedOrder.createdAt.toISOString(),
                customerId: updatedOrder.customerId,
                bookingId: updatedOrder.bookingId,
                subtotal: updatedOrder.subtotal.toNumber(),
                tax: updatedOrder.tax.toNumber(),
                total: updatedOrder.total.toNumber(),
                amountPaid: updatedOrder.amountPaid.toNumber(),
                change: updatedOrder.change.toNumber(),
                status: updatedOrder.status,
                paymentMethod: updatedOrder.paymentMethod,
                items: updatedOrder.orderItems.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    orderId: item.orderId,
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price.toNumber(),
                    },
                })),
            }
        }

        // If no order exists, create a new one
        const newOrder = await prisma.order.create({
            data: {
                bookingId: data.bookingId,
                subtotal,
                tax,
                total: data.total,
                amountPaid: data.amountPaid,
                change,
                orderItems: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
                status: OrderStatus.PENDING,
            },
            include: { orderItems: { include: { product: true } } },
        })

        return {
            id: newOrder.id,
            createdAt: newOrder.createdAt.toISOString(),
            customerId: newOrder.customerId,
            bookingId: newOrder.bookingId,
            subtotal: newOrder.subtotal.toNumber(),
            tax: newOrder.tax.toNumber(),
            total: newOrder.total.toNumber(),
            amountPaid: newOrder.amountPaid.toNumber(),
            change: newOrder.change.toNumber(),
            status: newOrder.status,
            paymentMethod: newOrder.paymentMethod,
            items: newOrder.orderItems.map((item) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                orderId: item.orderId,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price.toNumber(),
                },
            })),
        }
    } catch (error) {
        console.error("Failed to create or append order:", error)
        throw error
    }
}
