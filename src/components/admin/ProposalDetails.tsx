import { createSignal, For, Match, Show, Switch } from "solid-js";
import { PackageStatus, Package, updatePackage, UpdatePackageFormData, calculatePrice } from "~/lib/package"

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
      <div class="mt-6 p-4 border rounded bg-white shadow w-full sm:max-w-md">
        <div class="text-lg font-semibold">
          Package #{props.package?.id} - {props.package?.createdBy.fullName}
        </div>
        <div class="text-sm text-gray-600">
          Status: {props.package?.status === "APPROVED" ?
            (<span class="text-green-600 font-bold">APPROVED!</span>) :
            <span class="font-medium">{props.package?.status}</span>
          }
        </div>
        <div class="text-sm text-gray-700">
          Description: {props.package?.description}
        </div>
        <div class="text-sm text-gray-600">
          Reviewed by: <span class="font-medium">{props.package?.reviewedBy?.fullName ?? "not yet reviewed"}</span>
        </div>
        <div class="text-sm text-gray-600">
          Approved by: <span class="font-medium">{props.package?.approvedBy?.fullName ?? "not yet approved"}</span>
        </div>

        <div class="flex justify-between border-b py-1 text-gray-700" />

        <div class="space-y-2">
          <For each={props.package?.packageItems}>
            {(p) => (
              <div class="flex justify-between text-gray-700">
                <span>{p.name}</span>
                <span class="font-semibold">x {p.quantity}</span>
              </div>
            )}
          </For>

          {/* Price */}
          <div class="flex flex-col space-y-1 border-t pt-2">
            {/* Calculated/base price */}
            <div class="flex justify-between text-gray-600">
              <span>Calculated Price:</span>
              <span class="font-semibold">
                {calculatedPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
              </span>
            </div>

            {/* Show override/package price if set */}
            <Show when={overridePrice > 0}>
              <div class="flex justify-between text-gray-600">
                <span>Package Price:</span>
                <span class="font-semibold">
                  {overridePrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                </span>
              </div>

              {/* Difference colored */}
              <div class={`flex justify-between font-semibold ${diffColor}`}>
                <span>Difference:</span>
                <span>
                  {Math.abs(priceDiff).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                  {priceDiff > 0 ? " ↑" : priceDiff < 0 ? " ↓" : ""}
                </span>
              </div>
            </Show>

            {/* Total */}
            <div class="flex justify-between font-bold text-gray-800">
              <span>Total:</span>
              <span>
                {totalPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
              </span>
            </div>
          </div>
        </div>

        {/* CREATED / MODIFIED => Show Review + Edit */}
        <Show when={props.package?.status === PackageStatus.CREATED || props.package?.status === PackageStatus.MODIFIED}>
          <div class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1 text-center"
            onClick={handleReview}>
            Submit Review
          </div>
          <div class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1 text-center"
            onClick={props.onEdit}>
            Edit
          </div>
        </Show>

        {/* REVIEWED => Show Approve / Deny */}
        <Show when={props.package?.status === PackageStatus.REVIEWED}>
          <div class="flex gap-2 flex-1">
            <div
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1 text-center"
              onClick={handleApprove}
            >
              Approve
            </div>
            <div class="bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-400 flex-1 text-center">
              Deny
            </div>
          </div>
        </Show>
      </div>
    </Show>
  )
}