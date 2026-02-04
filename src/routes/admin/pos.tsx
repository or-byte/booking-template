import { createResource, createSignal, For, Show } from "solid-js";
import { cache, query} from "@solidjs/router";
import prisma from "~/lib/prisma";

export async function fetchCategories() {
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


export default function POS() {
    const [categories] = createResource(fetchCategories);
    const [categoryId, setCategory] = createSignal(7);
    const [products] = createResource(categoryId, getProductsByCategory);

    function handleSelectCategory(id: number) {
        setCategory(id);
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
                                <button>
                                    {p.name} – ${p.price}
                                </button>
                            )}
                        </For>
                    </ul>
                </Show>
            </section>

        </div>
    );
}
