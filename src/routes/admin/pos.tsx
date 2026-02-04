import { createResource, createSignal, For, Show } from "solid-js";
import { action, cache, query, useAction } from "@solidjs/router";
import prisma from "~/lib/prisma";

type Cart = {
    productId: number
    quantity: number
    name: string
    price: number
}

async function getCategories() {
    return await prisma.category.findMany();
}

const getProductsByCategory = query(async (id: number) => {
    "use server";
    const products = await prisma.product.findMany({ where: { categoryId: id } });

    return products.map(p => ({
        ...p,
        price: p.price.toNumber(),
    }));
}, "productsCategory");

const createOrder = action(async (formData: FormData) => {
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

export default function POS() {
    const createOrderAction = useAction(createOrder);
    const [categories] = createResource(getCategories);
    const [categoryId, setCategory] = createSignal(7);
    const [products] = createResource(categoryId, getProductsByCategory);

    const [cart, setCart] = createSignal<Cart[]>([]);



    function handleSelectCategory(id: number) {
        setCategory(id);
    }

    function handleAddToCart(product: { id: number; name: string; price: number }) {
        if (!product) return;

        setCart(prev => {
            const existingIndex = prev.findIndex(o => o.productId === product.id);

            if (existingIndex !== -1) {
                // udpate quantity
                const updated = [...prev];
                const updatedQuantity = updated[existingIndex].quantity + 1
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updatedQuantity,
                    price: updatedQuantity * product.price
                };
                return updated;
            } else {
                // add new
                return [...prev, { productId: product.id, name: product.name, quantity: 1, price: product.price }];
            }
        });
    }

    const handleCheckout = () => {
        const items = cart();
        if (items.length === 0) return;

        const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const tax = total * 0.12; // VAT
        const subtotal = total - tax;

        const formData = new FormData();
        formData.set("subtotal", subtotal.toString());
        formData.set("tax", tax.toString());
        formData.set("total", total.toString());
        formData.set("amountPaid", total.toString());
        formData.set("change", "0");
        formData.set("paymentMethod", "CASH");
        formData.set("items", JSON.stringify(items));

        createOrderAction(formData);
        
        setCart([]);
    };

    return (
        <div>
            Inventory Page
            <section>
                <button>Add Category</button>
                <button>Add Product</button>
            </section>

            <section>
                <h2>Categories</h2>
                <Show when={categories.loading}>
                    <p>Loading...</p>
                </Show>
                <Show when={categories.error}>
                    <p>Error loading categories</p>
                </Show>
                <Show when={categories()}>
                    <ul>
                        <For each={categories()}>
                            {(c) => <button onClick={[handleSelectCategory, c.id]}>{c.name}</button>}
                        </For>
                    </ul>
                </Show>
            </section>

            <section>
                <h2>Products</h2>
                <Show when={products.loading}>
                    <p>Loading products...</p>
                </Show>
                <Show when={products.error}>
                    <p>Error loading products</p>
                </Show>
                <Show when={products()}>
                    <ul>
                        <For each={products()}>
                            {(p) => (
                                <button onClick={[handleAddToCart, p]}>
                                    {p.name} – ${p.price}
                                </button>
                            )}
                        </For>
                    </ul>
                </Show>
            </section>

            <section>
                <h2>Cart</h2>
                <Show when={cart()}>
                    <ul>
                        <For each={cart()}>
                            {(o) => (
                                <li>{o.quantity} x {o.name} = ${o.price}</li>
                            )}
                        </For>
                    </ul>
                </Show>

                <button onClick={handleCheckout} disabled={createOrderAction.pending}>
                    {createOrderAction.pending ? "Processing..." : "Checkout"}
                </button>
            </section>
        </div>
    );
}
