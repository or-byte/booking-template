import { createSignal, For, Match, Show, Switch } from "solid-js";
import { PackageEventType, Package, UpdatePackageFormData, calculatePrice, reviewPackageAction, approvePackageAction, rejectPackageAction } from "~/lib/package";
import Button from "../button/Button";
import { useSession } from "~/lib/auth";
import { useAction } from "@solidjs/router";

export type ProposalDetailsProps = {
  package: Package | null
  onUpdate?: () => void
  onEdit?: () => void
  onCancel?: () => void
}

export default function ProposalDetails(props: ProposalDetailsProps) {
  const session = useSession();
  const getUserId = () => session().data?.user.id;

  // Package actions
  const reviewPackage = useAction(reviewPackageAction);
  const approvePackage = useAction(approvePackageAction);
  const rejectPackage = useAction(rejectPackageAction);

  // Calculated price is based on product price
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
      props.onUpdate?.();
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
      props.onUpdate?.();
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
      props.onUpdate?.();
    } catch (err) {
      console.log(err);
    }
  }

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
              Event Date : <span class="font-medium">{props.package?.eventDate.toDateString() ?? "N/A"}</span>
            </p>
            <p class="body-3 text-[#666666]">
              Number of Guests: <span class="font-medium">{props.package?.numberOfGuests ?? "N/A"}</span>
            </p>
          </div>

          <div class="flex justify-between border-b py-1 border-[var(--color-border-1)]" />
          <p class="body-3 text-[#666666]">
            Status: {props.package?.status === "APPROVED" ?
              (<span class="text-green-600 font-bold">APPROVED!</span>) :
              <span class="font-medium">{props.package?.status}</span>
            }
          </p>
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
      </div>
    </Show>
  )
}