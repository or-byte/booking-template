import { For, Show } from "solid-js";
import { Package, updatePackage, UpdatePackageFormData } from "~/lib/package"

export type ProposalSectionProps = {
  package: Package | null
  onUpdate?: () => void
}

export default function ProposalSection(props: ProposalSectionProps) {
  if (!props.package) return;

  const handleSubmitReview = async () => {
    const form: UpdatePackageFormData = {
      reviewedById: 1 // TODO replace with session user id
    }
    await updatePackage(props.package?.id, form);
    props.onUpdate();
  }

  const handleApprove = async () => {
    const form: UpdatePackageFormData = {
      approvedById: 1 // TODO repalce with session user id
    }
    await updatePackage(props.package?.id, form);
    props.onUpdate();
  }

  return <div>
    <div>
      Package # {props.package?.id} - {props.package?.createdBy.fullName}
    </div>
    <div>
      Description: {props.package?.description}
    </div>
    <div>Reviewed by: {props.package?.reviewedBy?.fullName ?? "not yet reviewed"}</div>
    <div>Approved by: {props.package?.approvedBy?.fullName ?? "not yet approved"}</div>

    <For each={props.package?.packageItems}>
      {(p) =>
        <div>
          {p.quantity} {p.name} {p.price}
        </div>}
    </For>

    <Show when={!props.package?.reviewedBy} fallback={
      <Show when={!props.package?.approvedBy}>
        <div class="flex gap-2 flex-1">
          <div class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1 text-center"
            onClick={handleApprove}>
            Approve
          </div>
          <div class="bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-400 flex-1 text-center">
            Deny
          </div>
        </div>
      </Show>
    }>
      <div class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1 text-center"
        onClick={handleSubmitReview}>
        Submit Review
      </div>
    </Show>

    <Show when={props.package?.approvedBy}>
      <div>
        APPROVED!
      </div>
    </Show>
  </div>
}