import { createResource, createSignal, For, Show } from "solid-js";
import { getCategories } from "~/lib/category";
import { getProductsByCategory } from "~/lib/product";
import { createOrder, OrderFormData } from "~/lib/order";
import { getAllRooms } from "~/lib/room";

type Cart = {
    productId: number
    quantity: number
    name: string
    price: number
}

export default function POS() {
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

    const handleCheckout = async () => {
        const items = cart();
        if (items.length === 0) return;

        const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        const data: OrderFormData = {
            items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            total,
            amountPaid: total // adjust later based on amount paid
        }

        try {
            await createOrder(data);
        } catch (e) {
            throw new Error("Order checkout failed!")
        }

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
                            {(c) => <button onClick={[handleSelectCategory, c.id]}>{c.name}({c._count.products})</button>}
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
                                    {p.name} – ${p.price} x {p.stockQty}
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

                <button onClick={handleCheckout}>
                    Checkout
                </button>
            </section>
        </div>
    );
}
