import { Title } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";
import { useSession } from "~/lib/auth";
import { createPackage, PackageFormData } from "~/lib/package";
import { ProductRoomsRequestForm } from "~/lib/product";

export default function BookingRequest() {
  const session = useSession();

  const [form, setForm] = createSignal<PackageFormData>({
    companyName: "",
    numberOfGuests: 0,
    contactNumber: "",
    contactEmail: "",
    eventDate: new Date,
    createdById: "",
    description: "",
    packageItems: []
  });

  const [requestedRooms, setRequestedRooms] = createSignal<ProductRoomsRequestForm>({
    deluxe: 0,
    superior: 0,
    standard: 0,
    loft: 0,
    dormOld: 0,
    dormNew: 0
  })  

  const roomAccommodations = () => {
    const deluxe = 4 * (requestedRooms()?.deluxe ?? 0);
    const superior = 4 * (requestedRooms()?.superior ?? 0);
    const standard = 2 * (requestedRooms()?.standard ?? 0);
    const loft = 8 * (requestedRooms()?.loft ?? 0);
    const dormOld = 20 * (requestedRooms()?.dormOld ?? 0);
    const dormNew = 26 * (requestedRooms()?.dormNew ?? 0);
    return deluxe + superior + standard + loft + dormOld + dormNew;
  }

  const excessPersons = () => {
    const extra = (form()?.numberOfGuests ?? 0) - roomAccommodations(); 
    return extra >= 0 ? extra : 0;
  }

  const handleSubmitForm = async () => {
    const packageItems = [{
      productId: 3,
      quantity: requestedRooms()?.deluxe ?? 0,
      price: 5400.00
    },
    {
      productId: 4,
      quantity: requestedRooms()?.superior ?? 0,
      price: 5000.00
    },
    {
      productId: 5,
      quantity: requestedRooms()?.standard ?? 0,
      price: 2800.00
    },
    {
      productId: 6,
      quantity: requestedRooms()?.loft ?? 0,
      price: 11200.00
    },
    {
      productId: 7,
      quantity: requestedRooms()?.dormOld ?? 0,
      price: 17200.00
    },
    {
      productId: 8,
      quantity: requestedRooms()?.dormNew ?? 0,
      price: 21100.00
    },
    {
      productId: 9,
      quantity: excessPersons(),
      price: 5400.00
    },
    ];

    const cleanedPackageItems = packageItems.filter(
      (item) => item.quantity > 0
    );

    const packageForm: PackageFormData = {
      companyName: form()?.companyName!,
      numberOfGuests: form()?.numberOfGuests!,
      contactNumber: form()?.contactNumber!,
      contactEmail: form()?.contactEmail!,
      eventDate: form()?.eventDate!,
      createdById: session().data?.user.id!,
      description: `${form()?.companyName!}'s Proposed Reservation`,
      packageItems: cleanedPackageItems
    }

    try {
      const pkg = await createPackage(packageForm);      
      alert(`Package creation success: \nPackage #${pkg.id}`)
    }
    catch (err) {
      console.error(err);
    }
  }

  return (
    <main>
      <Title>Package Proposal Form</Title>
      <h1>Hello, {session().data?.user.name || "Customer!"} </h1>

      <div class="flex flex-col gap-3">
        <h2> Info</h2>
        <label>
          Company Name:
          <input
            type="text"
            class="border p-1 rounded w-full"
            onInput={(e) =>
              setForm({ ...form(), companyName: e.currentTarget.value })
            }
          >
          </input>
        </label>
        <label>
          Contact Email:
          <input
            type="text"
            class="border p-1 rounded w-full"
            onInput={(e) =>
              setForm({ ...form(), contactEmail: e.currentTarget.value })
            }
          />
        </label>
        <label>
          Contact Number:
          <input
            type="text"
            class="border p-1 rounded w-full"
            onInput={(e) =>
              setForm({ ...form(), contactNumber: e.currentTarget.value })
            }
          >
          </input>
        </label>
        <label>
          Number of Guests:
          <input
            type="number"
            class="border p-1 rounded w-full"
            value={0}
            onInput={(e) =>
              setForm({ ...form(), numberOfGuests: Number(e.currentTarget.value) })
            }
          />
        </label>
        <label>
          Event Date:
          <input
            type="date"
            class="border p-1 rounded w-full"
            onInput={(e) =>
              setForm({ ...form(), eventDate: new Date(e.currentTarget.value) })
            }
          />
        </label>

        <h2>Room Accommodation</h2>
        <Show when={excessPersons() > 0}>
          <div>Excess persons: {excessPersons()}</div>
          <div>Accomodate them by adding rooms.</div>
        </Show>
        <div class=""></div>
        <label>
          Deluxe Room Quantity:
          <input
            type="number"
            class="border p-1 rounded w-full"
            value={0}
            onInput={(e) =>
              setRequestedRooms({ ...requestedRooms(), deluxe: Number(e.currentTarget.value)})
            }
          />
        </label>
        <label>
          Superior Room Quantity:
          <input
            type="number"
            class="border p-1 rounded w-full"
            value={0}
            onInput={(e) =>
              setRequestedRooms({ ...requestedRooms(), superior: Number(e.currentTarget.value) })
            }
          />
        </label>
        <label>
          Standard Room Quantity:
          <input
            type="number"
            class="border p-1 rounded w-full"
            value={0}
            onInput={(e) =>
              setRequestedRooms({ ...requestedRooms(), standard: Number(e.currentTarget.value) })
            }
          />
        </label>
        <label>
          Loft 8pax/unit:
          <input
            type="number"
            class="border p-1 rounded w-full"
            value={0}
            onInput={(e) =>
              setRequestedRooms({ ...requestedRooms(), loft: Number(e.currentTarget.value) })
            }
          />
        </label>
        <label>
          Dormitory Room 20pax:
          <input
            type="number"
            class="border p-1 rounded w-full"
            value={0}
            onInput={(e) =>
              setRequestedRooms({ ...requestedRooms(), dormOld: Number(e.currentTarget.value) })
            }
          />
        </label>
        <label>
          Dorm New 26pax:
          <input
            type="number"
            class="border p-1 rounded w-full"
            value={0}
            onInput={(e) =>
              setRequestedRooms({ ...requestedRooms(), dormNew: Number(e.currentTarget.value) })
            }
          />
        </label>
      </div>


      <button class="border rounded" onClick={handleSubmitForm}>Submit</button>
    </main>
  )
}