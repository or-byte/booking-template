import { createSignal, createResource, For, Show } from "solid-js";
import { BookingFormData, createNewBooking } from "~/lib/booking";
import { getRoomTypes } from "~/lib/room";

export default function Booking() {
  const [roomTypes] = createResource(getRoomTypes);
  const [toggleCreate, setToggle] = createSignal(true);

  const [customerFullName, setCustomerFullName] = createSignal("");
  const [customerEmail, setCustomerEmail] = createSignal("");
  const [adult, setAdult] = createSignal(0);
  const [children, setChildren] = createSignal(0);
  const [checkinDate, setCheckinDate] = createSignal("");
  const [checkoutDate, setCheckoutDate] = createSignal("");
  const [roomTypeId, setRoomTypeId] = createSignal<number | null>(null);

  const handleCreateNew = () => setToggle(!toggleCreate());

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const booking: BookingFormData = {
      customerFullName: customerFullName(),
      customerEmail: customerEmail(),
      roomTypeId: roomTypeId() ?? 0,
      numOfGuests: adult() + children(),
      checkinDate: new Date(checkinDate()),
      checkoutDate: new Date(checkoutDate()),
    };

    console.log("Booking:", booking);
    try {
        await createNewBooking(booking);
    } catch {
        throw new Error("Failed to create booking");
    }
  };

  return (
    <div>
      <section>
        <h2>Booking</h2>
        <button onClick={handleCreateNew}>Create new</button>
        <Show when={toggleCreate()}>
          <div>
            <h2>Create Booking</h2>
            <form onSubmit={handleSubmit}>
              Full Name{" "}
              <input
                type="text"
                value={customerFullName()}
                onInput={(e) => setCustomerFullName(e.currentTarget.value)}
              />{" "}
              <br />
              Email{" "}
              <input
                type="email"
                value={customerEmail()}
                onInput={(e) => setCustomerEmail(e.currentTarget.value)}
              />{" "}
              <br />
              Adult{" "}
              <input
                type="number"
                value={adult()}
                onInput={(e) => setAdult(Number(e.currentTarget.value))}
              />{" "}
              <br />
              Children{" "}
              <input
                type="number"
                value={children()}
                onInput={(e) => setChildren(Number(e.currentTarget.value))}
              />{" "}
              <br />
              Check In Date{" "}
              <input
                type="date"
                value={checkinDate()}
                onInput={(e) => setCheckinDate(e.currentTarget.value)}
              />{" "}
              <br />
              Check Out Date{" "}
              <input
                type="date"
                value={checkoutDate()}
                onInput={(e) => setCheckoutDate(e.currentTarget.value)}
              />{" "}
              <br />
              Room Type
              <select
                value={roomTypeId() ?? ""}
                onInput={(e) => setRoomTypeId(Number(e.currentTarget.value))}
              >
                <option value="">Select a room type</option>
                <For each={roomTypes()}>
                  {(rt) => <option value={rt.id}>{rt.name}</option>}
                </For>
              </select>
              <br />
              <button>Submit</button>
            </form>
          </div>
        </Show>
      </section>
    </div>
  );
}
