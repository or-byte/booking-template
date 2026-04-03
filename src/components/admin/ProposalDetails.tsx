import { createSignal, For, Match, Show, Switch } from "solid-js";
import { PackageStatus, Package, updatePackage, UpdatePackageFormData, calculatePrice } from "~/lib/package";
import Button from "../button/Button";

export type ProposalDetailsProps = {
  package: Package | null
  onUpdate?: () => void
  onEdit?: () => void
}

export default function ProposalDetails(props: ProposalDetailsProps) {
  const submitUpdate = async (form: UpdatePackageFormData) => {
    if (!props.package) return;

    try {
      await updatePackage(props.package!.id, form);
      props.onUpdate?.();
    } catch (err) {
      throw new Error(`Proposal update failed: ${err}`)
    }
  };

  // All about them prices
  const calculatedPrice = props.package ? calculatePrice(props.package) : 0;
  const overridePrice = props.package?.overridePrice ?? 0;
  const totalPrice = overridePrice > 0 ? overridePrice : calculatedPrice;

  // Difference only if overridePrice is set
  const priceDiff = overridePrice > 0 ? overridePrice - calculatedPrice : 0;
  const diffColor = priceDiff > 0 ? "text-red-600" : priceDiff < 0 ? "text-green-600" : "text-gray-600";

  const handleReview = async () => {
    submitUpdate({
      reviewedById: 1, //TODO session user
    });
  }

  const handleApprove = async () => {
    submitUpdate({
      approvedById: 1 //TODO session user
    })
  }

  return (
    <Show when={props.package}>
      <div class="p-4 border border-[var(--color-border-1)] rounded-[10px] bg-white shadow w-full sm:max-w-md text-left">
        <div class="flex flex-col gap-2">
          <p class="subtitle-1 font-bold">
            Package #{props.package?.id} - {props.package?.createdBy.fullName}
          </p>
          <p class="body-3 text-[#666666]">
            Status: {props.package?.status === "APPROVED" ?
              (<span class="text-green-600 font-bold">APPROVED!</span>) :
              <span class="font-medium">{props.package?.status}</span>
            }
          </p>
          <p class="body-3 text-[#666666]">
            Reviewed by: <span class="font-medium">{props.package?.reviewedBy?.fullName ?? "not yet reviewed"}</span>
          </p>
          <p class="body-3 text-[#666666]">
            Approved by: <span class="font-medium">{props.package?.approvedBy?.fullName ?? "not yet approved"}</span>
          </p>
        </div>

        <div class="flex justify-between border-b py-1 border-[var(--color-border-1)]" />
        <div class="space-y-2 mb-3">
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
                {calculatedPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
              </p>
            </div>

            {/* Show override/package price if set */}
            <Show when={overridePrice > 0}>
              <div class="flex justify-between text-gray-600">
                <p class="body-2">Package Price:</p>
                <p class="body-2 font-bold">
                  {overridePrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                </p>
              </div>

              {/* Difference colored */}
              <div class={`flex justify-between font-semibold ${diffColor}`}>
                <p class="body-2">Difference:</p>
                <p class="body-2 font-bold">
                  {Math.abs(priceDiff).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                  {priceDiff > 0 ? " ↑" : priceDiff < 0 ? " ↓" : ""}
                </p>
              </div>
            </Show>

            {/* Total */}
            <div class="flex justify-between font-bold text-gray-800">
              <p class="body-1 font-bold">Total:</p>
              <p class="body-1 font-bold">
                {totalPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
              </p>
            </div>
          </div>
        </div>

        {/* CREATED / MODIFIED => Show Review + Edit */}
        <Show when={props.package?.status === PackageStatus.CREATED || props.package?.status === PackageStatus.MODIFIED}>
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

        {/* REVIEWED => Show Approve / Deny */}
        <Show when={props.package?.status === PackageStatus.REVIEWED}>
          <div class="flex gap-2 flex-1">
            <Button
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1 text-center"
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button class="bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-400 flex-1 text-center">
              Deny
            </Button>
          </div>
        </Show>
      </div>
    </Show>
  )
}