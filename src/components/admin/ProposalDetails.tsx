import { createMemo, createResource, For, Show } from "solid-js";
import { PackageEventType, Package, calculatePrice, reviewPackageAction, approvePackageAction, rejectPackageAction, getPackageEvents } from "~/lib/package";
import Button from "../button/Button";
import { useSession } from "~/lib/auth";
import { useAction } from "@solidjs/router";
import { BookingFormData, BookingStatus, createNewBooking } from "~/lib/booking";
import { statusDescriptionMap } from "~/lib/google/templates/status";

export type ProposalDetailsProps = {
  package: Package | null
  onUpdate?: (pkg: Package) => void
  onEdit?: () => void
  onCancel?: () => void
}

export default function ProposalDetails(props: ProposalDetailsProps) {
  const session = useSession();
  const getUserId: () => string | undefined = () => session().data?.user.id;

  // Package Events states
  const [packageEvents] = createResource(props.package?.id, (packageId) => getPackageEvents(packageId));

  // Package actions
  const reviewPackage = useAction(reviewPackageAction);
  const approvePackage = useAction(approvePackageAction);
  const rejectPackage = useAction(rejectPackageAction);

  // Date
  const startDate = createMemo(() => {
    if (props.package?.eventDate) return props.package.eventDate;
    return new Date(); // fallback to today if undefined
  });

  const endDate = createMemo(() => {
    const start = startDate();
    const duration = props.package?.durationInDays ?? 1; // fallback to 1 day if undefined
    return new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
  });

  // Prices
  const calculatedPrice = () => props.package ? calculatePrice(props.package) : 0;
  const overridePrice = () => props.package?.overridePrice ?? 0;
  const totalPrice = () => overridePrice() > 0 ? overridePrice() : calculatedPrice();

  // Difference only if overridePrice is set
  const priceDiff = () => overridePrice() > 0 ? overridePrice() - calculatedPrice() : 0;
  const diffColor = () => priceDiff() > 0 ? "text-red-600" : priceDiff() < 0 ? "text-green-600" : "text-gray-600";

  const handleReview = async () => {
    if (!props.package) return;

    const userId = getUserId();
    if (!userId) return;

    try {
      await reviewPackage(props.package.id, userId);

      if (!props.onUpdate) return;
      props.onUpdate?.(props.package);
    } catch (err) {
      console.error(err);
    }
  }

  const handleApprove = async () => {
    if (!props.package) return;

    const userId = getUserId();
    if (!userId) return;

    try {
      await approvePackage(props.package.id, userId);

      if (!props.onUpdate) return;
      props.onUpdate?.(props.package);
    } catch (err) {
      console.log(err);
    }
  }

  const handleReject = async () => {
    if (!props.package) return;

    const userId = getUserId();
    if (!userId) return;

    try {
      await rejectPackage(props.package.id, userId);

      if (!props.onUpdate) return;
      props.onUpdate?.(props.package);
    } catch (err) {
      console.log(err);
    }
  }

  const handleGenerateBookings = async () => {
    const rooms = props.package?.packageItems?.filter(item => item.category === "Room") ?? [];

    const forms: BookingFormData[] = [];

    for (const room of rooms) {
      for (let i = 0; i < room.quantity; i++) {
        forms.push({
          productId: room.productId,
          checkInDate: startDate(),
          checkOutDate: endDate(),
          status: BookingStatus.CONFIRMED,
        });
      }
    }

    const email = props.package?.contactEmail;
    if (!email) {
      console.error("no contact email");
      return;
    }

    try {
      const created = await createNewBooking(email, forms);

      if (created.length < forms.length) {
        alert(`Only ${created.length} out of ${forms.length} bookings were created. Some rooms are unavailable.`);
      } else {
        alert("All bookings successfully created!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate bookings");
    }
  };

  return (
    <Show when={props.package}>
      <div class="p-4 border border-[var(--color-border-1)] rounded-[10px] bg-white shadow w-full sm:max-w-md text-left">
        <div class="flex flex-col gap-2">
          <p class="subtitle-1 font-bold">
            Package #{props.package?.id} - {props.package?.companyName}
          </p>

          <div class="space-y-2 my-3">
            <p class="body-3 text-[#666666]">
              Contact Number: <span class="font-medium">{props.package?.contactNumber ?? "N/A"}</span>
            </p>
            <p class="body-3 text-[#666666]">
              Contact Email: <span class="font-medium">{props.package?.contactEmail ?? "N/A"}</span>
            </p>
            <p class="body-3 text-[#666666]">
              Event Dates :
              <span class="font-medium">
                {props.package?.eventDate
                  ? (() => {
                    const start = new Date(props.package.eventDate);
                    const end = new Date(start);
                    end.setDate(start.getDate() + (props.package.durationInDays ?? 0));

                    return `${start.toDateString()} - ${end.toDateString()}`;
                  })()
                  : "N/A"}
              </span>
            </p>
            <p class="body-3 text-[#666666]">
              Number of Guests: <span class="font-medium">{props.package?.numberOfGuests ?? "N/A"}</span>
            </p>
          </div>

          {/* Package Events */}
          <div class="flex justify-between border-b py-1 border-[var(--color-border-1)]" />

          <div class="w-full max-h-[250px] overflow-y-auto pr-2">
            <div class="relative border-gray-200 ml-2">

              <Show when={!packageEvents.loading}>
                <For each={[...(packageEvents() ?? [])].reverse()}>
                  {(e, i) => {
                    const isLatest = i() === 0;

                    return (
                      <div class="flex gap-3 mb-6 relative">

                        {/* Icon column */}
                        <div class="relative flex flex-col items-center">
                          <div class="absolute top-5 bottom-[-24px] w-px bg-gray-200"></div>

                          <div
                            class={`flex items-center justify-center w-5 h-5 rounded-full border z-10
                  ${isLatest
                                ? "bg-green-500 text-white border-green-500 text-[10px]"
                                : "bg-white text-gray-400 border-gray-300"}`}
                          >
                            {isLatest ? "✓" : ""}
                          </div>
                        </div>

                        {/* Content */}
                        <div class="flex-1 leading-relaxed">
                          <div class="text-xs text-gray-500 mb-1">
                            {e.createdAt.toLocaleString()}
                          </div>

                          <div class={`text-sm font-semibold mb-1 ${isLatest ? "text-green-600" : "text-gray-700"}`}>
                            {e.type}
                          </div>

                          <div class="text-sm text-gray-600">
                            {statusDescriptionMap[e.type]} <br />
                            by {e.createdBy.name}
                          </div>
                        </div>

                      </div>
                    );
                  }}
                </For>
              </Show>

            </div>
          </div>
        </div>

        <div class="flex justify-between border-b py-1 border-[var(--color-border-1)]" />
        <div class="space-y-2 my-3">
          <For each={props.package?.packageItems}>
            {(p) => (
              <div class="flex justify-between text-gray-700">
                <span>{p.name}</span>
                <span class="font-semibold">x {p.quantity}</span>
              </div>
            )}
          </For>

          {/* Price */}
          <div class="flex flex-col space-y-1 border-t border-[var(--color-border-1)] pt-2">
            {/* Calculated/base price */}
            <div class="flex justify-between text-gray-600">
              <p class="body-2">Calculated Price:</p>
              <p class="body-2">
                {calculatedPrice().toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
              </p>
            </div>

            {/* Show override/package price if set */}
            <Show when={overridePrice() > 0}>
              <div class="flex justify-between text-gray-600">
                <p class="body-2">Package Price:</p>
                <p class="body-2 font-bold">
                  {overridePrice().toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                </p>
              </div>

              {/* Difference colored */}
              <div class={`flex justify-between font-semibold ${diffColor}`}>
                <p class="body-2">Difference:</p>
                <p class="body-2 font-bold">
                  {Math.abs(priceDiff()).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                  {priceDiff() > 0 ? " ↑" : priceDiff() < 0 ? " ↓" : ""}
                </p>
              </div>
            </Show>

            {/* Total */}
            <div class="flex justify-between font-bold text-gray-800">
              <p class="body-1 font-bold">Total:</p>
              <p class="body-1 font-bold">
                {totalPrice().toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
              </p>
            </div>
          </div>
        </div>

        {/* CREATED / MODIFIED => Show Review + Edit */}
        <Show when={props.package?.status === PackageEventType.CREATED || props.package?.status === PackageEventType.MODIFIED}>
          <div class="w-full flex flex-col gap-3">
            <Button class="btn"
              onClick={handleReview}>
              Submit Review
            </Button>
            <Button class="bg-[#FEBE66] px-4 py-2 rounded hover:bg-[#FFD7A1] text-center rounded-[10px]"
              onClick={props.onEdit}>
              Edit
            </Button>
          </div>
        </Show>

        {/* REVIEWED => Show Approve / Reject */}
        <Show when={props.package?.status === PackageEventType.REVIEWED}>
          <div class="flex gap-2 flex-col">
            <Button
              class="btn"
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button class="py-2 px-6 bg-[#D6D6D6] rounded-[10px] hover:cursor-pointer hover:bg-[#E3E3E3]"
              onClick={handleReject}>
              Reject
            </Button>
          </div>
        </Show>

        {/* APPROVED => Show Generate Bookings button */}
        <Show when={props.package?.status === PackageEventType.APPROVED}>
          <div class="flex gap-2 flex-1">
            <div
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1 text-center"
              onClick={handleGenerateBookings}
            >
              Generate Bookings
            </div>
          </div>
        </Show>
      </div>
    </Show>
  )
}