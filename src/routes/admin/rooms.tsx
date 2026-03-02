import { createResource, createSignal, onCleanup, Show, For } from "solid-js";
import { Booking, BookingWithCustomer, getAllFutureBookings as getAllConfirmedBookings } from "~/lib/booking";
import { getAllRooms, Room } from "~/lib/room";
import { parseBookingRange } from "~/utils/booking";

export default function AdminRooms() {
    const [time, setTime] = createSignal(Date.now());

    const interval = setInterval(() => {
        setTime(Date.now());
    }, 1000);
    onCleanup(() => clearInterval(interval));

    const [rooms] = createResource<Room[]>(getAllRooms);
    const [selectedRoom, setSelectedRoom] = createSignal<Room>()
    const handleSelectRoom = (room: Room) => {
        setSelectedRoom(room);
        console.log(bookingsForRoomToday());
    }

    const [bookings] = createResource<BookingWithCustomer[]>(getAllConfirmedBookings);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // midnight today

    // Bookings for the selected room that include today
    const bookingsForRoomToday = () =>
        bookings()?.filter((b) => {
            if (b.roomId !== selectedRoom()?.id) return false;

            const [start, end] = parseBookingRange(b.checkInRange);
            const checkIn = new Date(start);
            const checkOut = new Date(end);

            // check if today is inside [checkIn, checkOut)
            return checkIn <= today && today < checkOut;
        });

    // Bookings for the selected room that start in the future
    const bookingsForRoomInFuture = () =>
        bookings()?.filter((b) => {
            if (b.roomId !== selectedRoom()?.id) return false;

            const [start] = parseBookingRange(b.checkInRange);
            const checkIn = new Date(start);

            // future bookings = checkIn is after today
            return checkIn > today;
        });

    return (
        <div>
            <section>
                Time: {new Date(time()).toLocaleTimeString()}
            </section>

            <section>
                <Show when={rooms()}>
                    <For each={rooms()}>
                        {(room) =>
                            <button onClick={[handleSelectRoom, room]}>{room.name}</button>
                        }
                    </For>
                </Show>

                <div>
                    <Show when={selectedRoom()}>
                        <h3>Today's Bookings</h3>
                        <For each={bookingsForRoomToday()}>
                            {(b) => {
                                const [checkIn, checkOut] = parseBookingRange(b.checkInRange);
                                return (
                                    <div>
                                        Booking ID: {b.id} <br />
                                        Customer: {b.customer.fullName} <br />
                                        Booking: {checkIn} → {checkOut} <br />
                                    </div>
                                );
                            }}
                        </For>

                        <h3>Future Bookings</h3>
                        <For each={bookingsForRoomInFuture()}>
                            {(b) => {
                                const [checkIn, checkOut] = parseBookingRange(b.checkInRange);
                                return (
                                    <div>
                                        Booking ID: {b.id} <br />
                                        Customer: {b.customer.fullName} <br />
                                        Booking: {checkIn} → {checkOut} <br />
                                    </div>
                                );
                            }}
                        </For>
                    </Show>
                </div>
            </section>
        </div >
    );
}