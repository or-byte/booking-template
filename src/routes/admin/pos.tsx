import { createResource, createSignal, For, Show } from "solid-js";
import { getCategories } from "~/lib/category";
import { getProductsByCategory } from "~/lib/product";
import { createOrAppendOrder, getOrderByBooking, OrderFormData } from "~/lib/order";
import { BookingWithCustomer, getAllFutureBookings } from "~/lib/booking";
import { parseBookingRange } from "~/utils/booking";

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

    const [activeBookings] = createResource(async () => {
        try {
            const bookings = await getAllFutureBookings();
            const now = new Date();

            return bookings?.filter((b) => {
                const [start, end] = parseBookingRange(b.checkInRange);
                const checkIn = new Date(start);
                const checkOut = new Date(end);
                return checkIn <= now && now < checkOut;
            });
        } catch (e) {
            console.error("Failed to fetch bookings:", e);
            return [];
        }
    });
    const [selectedBooking, setSelectedBooking] = createSignal<BookingWithCustomer>();

    const [cart, setCart] = createSignal<Cart[]>([]);

    const [currentOrder, { refetch }] = createResource(
        () => selectedBooking(),
        async (booking) => {
            if (!booking) return null;

            try {
                const order = await getOrderByBooking(booking.id);
                return order;
            } catch (e) {
                console.error(e)
            }
        },
        { initialValue: null }
    );

    async function handleSelectBooking(booking: BookingWithCustomer) {
        setSelectedBooking(booking);
    }

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

        if (!selectedBooking()?.id) {
            alert("No booking selected");
            return;
        }

        const data : OrderFormData = {
            items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            amountPaid: items.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
            ), // TODO change to actual amount paid
            bookingId: selectedBooking()?.id
        };

        try {
            const order = await createOrAppendOrder(data);

            alert(
                `Order #${order.id}\nTotal: ₱${order.total}\nChange: ₱${order.change}`
            );

            refetch();
            setCart([]);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            Inventory Page
            <section>
                <button>Add Category</button>
                <button>Add Product</button>
            </section>

            <section>
                <h2> Active Bookings </h2>
                <For each={activeBookings()}>
                    {(b) => {
                        const [checkIn, checkOut] = parseBookingRange(b.checkInRange);
                        return (
                            <button onClick={[handleSelectBooking, b]}>
                                Booking ID: {b.id} <br />
                                Customer: {b.customer.fullName} <br />
                                Booking: {checkIn} → {checkOut} <br />
                            </button>
                        );
                    }}
                </For>
            </section>

            <section>
                <Show when={selectedBooking()}>
                    <h2>
                        <Show
                            when={currentOrder()}
                            fallback={`Checkout to add items to ${selectedBooking()?.customer.fullName}'s Order`}
                        >
                            {selectedBooking()?.customer.fullName}'s Order
                        </Show>
                    </h2>

                    <Show when={currentOrder()}>
                        <div>
                            <For each={currentOrder()?.items}>
                                {(item) => (
                                    <div>
                                        {item.product.name} × {item.quantity} — ₱{item.product.price}
                                    </div>
                                )}
                            </For>
                            <div>
                                ₱{currentOrder()?.subtotal} + ₱{currentOrder()?.tax} = ₱{currentOrder()?.total}
                                (Paid: ₱{currentOrder()?.amountPaid}, Change: ₱{currentOrder()?.change})
                            </div>
                        </div>
                    </Show>

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
                </Show>
            </section>
        </div>
    );
}
