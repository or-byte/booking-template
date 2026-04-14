import { Title } from "@solidjs/meta";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import Button from "~/components/button/Button";
import Input from "~/components/input/Input";
import InputNumberStepper from "~/components/input/InputNumberStepper";
import { signInWithGoogle, useSession } from "~/lib/auth";
import { createPackageAction, PackageFormData } from "~/lib/package";
import { ProductRoomsRequestCounter } from "~/lib/product";

type RoomKey = keyof ProductRoomsRequestCounter;

const rooms: { key: RoomKey; label: string }[] = [
  { key: "deluxe", label: "Deluxe" },
  { key: "superior", label: "Superior" },
  { key: "standard", label: "Standard" },
  { key: "loft", label: "Loft 8pax" },
  { key: "dormOld", label: "Dorm 20pax" },
  { key: "dormNew", label: "Dorm 26pax" }
];

export default function BookingRequest() {
  const session = useSession();

  async function handleSignIn(): Promise<void> {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.log(e);
    }
  }

  const [form, setForm] = createSignal<PackageFormData>({
    companyName: "",
    numberOfGuests: 0,
    contactNumber: "",
    contactEmail: "",
    eventDate: new Date(),
    createdById: "",
    description: "",
    packageItems: []
  });

  const [requestedRooms, setRequestedRooms] = createSignal<ProductRoomsRequestCounter>({
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
    return (form()?.numberOfGuests ?? 0) - roomAccommodations();
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
      const pkg = await createPackageAction(packageForm);
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

      <Show when={session().data?.user}
        fallback={
          <div class="px-6 sm:px-0 max-w-sm">
            <button onClick={handleSignIn} type="button" class="cursor-pointer text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2">
              <svg class="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>Sign up with Google<div></div></button>
          </div>
        }>
        <div class="flex flex-col gap-3">
          <h2> Info</h2>
          <label class="text-left">
            <p class="body-2 font-bold pb-2">Company Name:</p>
            <Input
              onInput={(e) => setForm({ ...form(), companyName: e.currentTarget.value })}
            />
          </label>
          <label class="text-left">
            <p class="body-2 font-bold pb-2">Contact Number:</p>
            <Input
              onInput={(e) => setForm({ ...form(), contactNumber: e.currentTarget.value })}
            />
          </label>
          <label class="text-left">
            <p class="body-2 font-bold pb-2">Contact Email:</p>
            <Input
              onInput={(e) => setForm({ ...form(), contactEmail: e.currentTarget.value })}
            />
          </label>
          <label class="text-left">
            <p class="body-2 font-bold pb-2">Number of Guests:</p>
            <Input
              type="number"
              value={0}
              onInput={(e) => setForm({ ...form(), numberOfGuests: Number(e.currentTarget.value) })}
            />
          </label>
          <label class="text-left">
            <p class="body-2 font-bold pb-2">Event Date:</p>
            <input
              type="date"
              value={new Date().toISOString().split("T")[0]}
              onInput={(e) => setForm({ ...form(), eventDate: new Date(e.currentTarget.value) })}
            />
          </label>

          <h2>Room Accommodation</h2>
          <Switch>
            <Match when={excessPersons() > 0}>
              <div>Excess persons: {excessPersons()}</div>
              <div>Accomodate them by adding rooms.</div>
            </Match>
            <Match when={excessPersons() < 0}>
              <div>Excess beds from current accomodation: {Math.abs(excessPersons())}</div>
            </Match>
          </Switch>
          <div class="flex gap-6 flex-wrap">
            <For each={rooms}>
              {(room) => (
                <InputNumberStepper
                  label={room.label}
                  value={requestedRooms()[room.key]}
                  onChange={(v) =>
                    setRequestedRooms((prev) => ({
                      ...prev,
                      [room.key]: v
                    }))
                  }
                />
              )}
            </For>
          </div>
        </div>
        <Button class="btn" onClick={handleSubmitForm}>Submit</Button>
      </Show>
    </main>
  )
}