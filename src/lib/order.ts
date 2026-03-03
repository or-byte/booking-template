import { OrderStatus } from "@prisma/client"
import prisma from "./prisma";

export type OrderFormData = {
    items: {
        productId: number;
        quantity: number;
    }[];
    amountPaid: number;
    bookingId?: number;
}

export type OrderResponse = {
    id: number
    createdAt: string
    customerId: number | null
    bookingId: number | null
    subtotal: number
    tax: number
    total: number
    amountPaid: number
    change: number
    status: string
    paymentMethod: string | null
    items: {
        id: number
        productId: number
        quantity: number
        orderId: number
        product: {
            id: number
            name: string
            price: number
        }
    }[]
}

const formatOrder = (order: any): OrderResponse => ({
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    customerId: order.customerId ?? null,
    bookingId: order.bookingId ?? null,
    subtotal: order.subtotal.toNumber(),
    tax: order.tax.toNumber(),
    total: order.total.toNumber(),
    amountPaid: order.amountPaid.toNumber(),
    change: order.change.toNumber(),
    status: order.status,
    paymentMethod: order.paymentMethod,
    items: order.orderItems.map((item: any) => ({
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
})

export const getOrderByBooking = async (bookingId: number): Promise<OrderResponse | null> => {
    "use server"
    const order = await prisma.order.findFirst({
        where: { bookingId },
        include: {
            orderItems: { include: { product: true } },
        },
    })

    if (!order) return null

    return formatOrder(order);
}

export const createOrAppendOrder = async (data: OrderFormData) => {
    "use server"

    const VAT_RATE = 0.12

    return await prisma.$transaction(async (tx) => {

        let order = await tx.order.findFirst({
            where: { bookingId: data.bookingId },
            include: { orderItems: { include: { product: true } } },
        })

        if (!order) {
            order = await tx.order.create({
                data: {
                    bookingId: data.bookingId,
                    subtotal: 0,
                    tax: 0,
                    total: 0,
                    amountPaid: 0,
                    change: 0,
                    status: OrderStatus.PENDING,
                },
                include: { orderItems: { include: { product: true } } },
            })
        }

        for (const newItem of data.items) {
            const existingItem = order.orderItems.find(
                i => i.productId === newItem.productId
            )

            if (existingItem) {
                await tx.orderItem.update({
                    where: { id: existingItem.id },
                    data: {
                        quantity: existingItem.quantity + newItem.quantity,
                    },
                })
            } else {
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: newItem.productId,
                        quantity: newItem.quantity,
                    },
                })
            }
        }

        const updatedOrder = await tx.order.findUnique({
            where: { id: order.id },
            include: { orderItems: { include: { product: true } } },
        })

        if (!updatedOrder) {
            throw new Error("Order not found after update")
        }

        let vatInclusiveTotal = 0

        for (const item of updatedOrder.orderItems) {
            vatInclusiveTotal +=
                item.quantity * item.product.price.toNumber()
        }

        const subtotal = vatInclusiveTotal / (1 + VAT_RATE)
        const tax = vatInclusiveTotal - subtotal
        const total = vatInclusiveTotal
        const change = data.amountPaid - total

        const finalOrder = await tx.order.update({
            where: { id: updatedOrder.id },
            data: {
                subtotal,
                tax,
                total,
                amountPaid: data.amountPaid,
                change,
            },
            include: { orderItems: { include: { product: true } } },
        })

        return formatOrder(finalOrder)
    })
}