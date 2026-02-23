import { BookingStatus } from "@prisma/client";
import { createSignal, createResource, For, Show, Setter, Accessor } from "solid-js";
import { BookingFormData, createNewBooking } from "~/lib/booking";
import { Product } from "~/lib/product";
import { getAllRoomTypes, getAvailableRoom } from "~/lib/room";

export default function Booking() {
  const [roomTypes] = createResource(getAllRoomTypes); // Room types are products of category "Room"
  const [selectedRoomType, setRoomType] = createSignal<Product>();
  const [roomId, setRoomId] = createSignal<number>();

  const [customerFullName, setCustomerFullName] = createSignal("");
  const [customerEmail, setCustomerEmail] = createSignal("");
  const [adult, setAdult] = createSignal(0);
  const [children, setChildren] = createSignal(0);
  const [checkinDate, setCheckinDate] = createSignal("");
  const [checkoutDate, setCheckoutDate] = createSignal("");


  const handleRoomTypeSelect = async (roomType: any) => {
    setRoomType(roomType);
  }

  const handleRoomFind = async () => {
    const room = await getAvailableRoom(selectedRoomType()!.id, new Date(checkinDate()), new Date(checkoutDate()));

    setRoomId(room.id);
  }

  const handleAddPerson = async (accessor: Accessor<number>, setter: Setter<number>, add: boolean = true) => {
    const value = add ? 1 : -1;
    setter(accessor() + value);
  }

  const handleBookNow = async () => {
    try {
      const booking = await createNewBooking({
        productId: selectedRoomType()!.id,
        customerFullName: customerFullName(),
        customerEmail: customerEmail(),
        numOfGuests: adult() + children(),
        checkIn: new Date(checkinDate()),
        checkOut: new Date(checkoutDate()),
        status: BookingStatus.CONFIRMED
      });
      console.log(booking)
    } catch (err) {
      console.error(err);
      throw new Error("Failed to create booking");
    }
  };

  return (
    <div>
      <section>
        {/* Room Type Buttons */}
        <section>
          <Show when={roomTypes()?.length}>
            <For each={roomTypes()}>
              {(rt) => (
                <button
                  type="button"
                  onClick={[handleRoomTypeSelect, rt]}
                >
                  {rt.name} PHP {rt.price}
                </button>
              )}
            </For>
          </Show>
        </section>

        {/* Booking Form */}
        <div>
          <Show when={selectedRoomType()}>
            <h2>
              Create Booking for {selectedRoomType()!.name}
            </h2>

            Select dates: {"  "}
            <input
              type="date"
              value={checkinDate()}
              onInput={(e) =>
                setCheckinDate(e.currentTarget.value)
              }
            />
            -
            <input
              type="date"
              value={checkoutDate()}
              onInput={(e) =>
                setCheckoutDate(e.currentTarget.value)
              }
            />

            {/* Find rooms */}
            <div>
              <Show when={checkinDate}>
                Selected dates: {checkinDate()}
              </Show>
              <Show when={checkoutDate()}>
                - {checkoutDate()}
              </Show>
            </div>
            <Show when={checkoutDate() && checkinDate()}>
              <button onclick={handleRoomFind}>Find me rooms!</button>
            </Show>

            <Show when={roomId()}>
              <p>Room found: {roomId()}</p>

              Full Name
              <input
                type="text"
                value={customerFullName()}
                onInput={(e) =>
                  setCustomerFullName(e.currentTarget.value)
                }
              />
              <br />

              Email
              <input
                type="email"
                value={customerEmail()}
                onInput={(e) =>
                  setCustomerEmail(e.currentTarget.value)
                }
              />
              <br />

              Adult: <button onClick={() => handleAddPerson(adult, setAdult, false)}>-</button> {adult()} <button onClick={() => handleAddPerson(adult, setAdult)}>+</button>
              <br />

              Children: <button onClick={() => handleAddPerson(children, setChildren, false)}>-</button> {children()} <button onClick={() => handleAddPerson(children, setChildren)}>+</button>

              <button onClick={handleBookNow}>Book now!</button>
            </Show>
          </Show>
        </div>
      </section >
    </div >
  );
}
