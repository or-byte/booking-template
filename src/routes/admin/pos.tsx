import { createResource, createSignal, For, Show } from "solid-js";
import { cache, query } from "@solidjs/router";
import prisma from "~/lib/prisma";
import { Product } from "@prisma/client";

async function fetchCategories() {
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

type Order = {
    productId: number
    quantity: number
    name: string
}


export default function POS() {
    const [categories] = createResource(fetchCategories);
    const [categoryId, setCategory] = createSignal(7);
    const [products] = createResource(categoryId, getProductsByCategory);

    const [order, setOrder] = createSignal<Order[]>([]);

    function handleSelectCategory(id: number) {
        setCategory(id);
    }

    function handleAddOrder(product: { id: number; name: string }) {
        if (!product) return;

        setOrder(prev => {
            const existingIndex = prev.findIndex(o => o.productId === product.id);

            if (existingIndex !== -1) {
                // udpate quantity
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + 1,
                };
                return updated;
            } else {
                // add new
                return [...prev, { productId: product.id, name: product.name, quantity: 1 }];
            }
        });
    }

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
                            {(c) => <button onClick={handleSelectCategory.bind(null, c.id)}>{c.name}</button>}
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
                                <button onClick={handleAddOrder.bind(null, p)}>
                                    {p.name} – ${p.price}
                                </button>
                            )}
                        </For>
                    </ul>
                </Show>
            </section>

            <section>
                <h2>Order Listing</h2>
                <Show when={order()}>
                    <ul>
                        <For each={order()}>
                            {(o) => (
                                <li>{o.quantity} x {o.name}</li>
                            )}
                        </For>
                    </ul>
                </Show>
            </section>
        </div>
    );
}
