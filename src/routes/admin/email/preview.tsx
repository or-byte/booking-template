import { createSignal, Show, createEffect, For } from "solid-js";
import Button from "~/components/button/Button";
import { sendEmail } from "~/lib/google/email";
import adminBodyDefault from "~/lib/google/templates/admin";
import defaultBodyTemplate from "~/lib/google/templates/default";
import { Package, PackageEvent, PackageEventType } from "~/lib/package";
import { User } from "~/lib/user";

const users: Record<string, User> = {
  customer: {
    id: "u1",
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    role: "CUSTOMER",
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  staff: {
    id: "u2",
    name: "Maria Santos",
    email: "maria@example.com",
    role: "STAFF",
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  admin: {
    id: "u3",
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
}

const packageEvents: Record<string, PackageEvent> = {
  create: {
    id: 1,
    createdAt: new Date("2026-04-10T09:00:00"),
    type: PackageEventType.CREATED,
    createdById: "u1",
    createdBy: users.customer,
  },
  modify: {
    id: 2,
    createdAt: new Date("2026-04-10T10:15:00"),
    type: PackageEventType.MODIFIED,
    createdById: "u2",
    createdBy: users.staff,
  },
  review: {
    id: 3,
    createdAt: new Date("2026-04-11T08:30:00"),
    type: PackageEventType.REVIEWED,
    createdById: "u3",
    createdBy: users.staff,
  },
  approve: {
    id: 4,
    createdAt: new Date("2026-04-11T11:45:00"),
    type: PackageEventType.APPROVED,
    createdById: "u2",
    createdBy: users.admin,
  },
  reject: {
    id: 5,
    createdAt: new Date("2026-04-11T11:45:00"),
    type: PackageEventType.REJECTED,
    createdById: "u2",
    createdBy: users.admin,
  },
  cancel: {
    id: 6,
    createdAt: new Date("2026-04-11T11:45:00"),
    type: PackageEventType.CANCELLED,
    createdById: "u2",
    createdBy: users.customer,
  }
};

const samplePackage: Package = {
  id: 67,
  companyName: "Sample Company",
  contactNumber: "+639123456789",
  contactEmail: users.customer.email,
  numberOfGuests: 8,
  eventDate: new Date(),
  reservationDate: new Date(),
  description: "Sample Proposed Package for Company Outing",
  packageItems: [
    {
      id: 1,
      packageId: 67,
      productId: 1,
      quantity: 1,
      name: "Buffet Meal Package",
      price: 1500,
    }
  ],
  packageEvents: [],
  status: PackageEventType.CREATED,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const roleButtons: { label: string; value: boolean }[] = [
  { label: "Customer", value: true },
  { label: "Admin", value: false },
]

const statusButtons: { label: string; value: PackageEventType }[] = [
  { label: "Created", value: PackageEventType.CREATED },
  { label: "Modified", value: PackageEventType.MODIFIED },
  { label: "Reviewed", value: PackageEventType.REVIEWED },
  { label: "Approved", value: PackageEventType.APPROVED },
  { label: "Rejected", value: PackageEventType.REJECTED },
  { label: "Cancelled", value: PackageEventType.CANCELLED },
];

export default function EmailPreview() {
  const [previewRef, setPreviewRef] = createSignal<HTMLDivElement>();
  const [error, setError] = createSignal("");
  const [isCustomerView, setIsCustomerView] = createSignal(true);
  const [status, setStatus] = createSignal<PackageEventType>(samplePackage.status);
  const events = () => {
    switch (status()) {
      case PackageEventType.CREATED:
        return [packageEvents.create];
      case PackageEventType.MODIFIED:
        return [packageEvents.modify];
      case PackageEventType.REVIEWED:
        return [packageEvents.review, packageEvents.create];
      case PackageEventType.APPROVED:
        return [packageEvents.approve, packageEvents.review, packageEvents.create];
      case PackageEventType.REJECTED:
        return [packageEvents.reject, packageEvents.review, packageEvents.create];
      case PackageEventType.CANCELLED:
        return [packageEvents.cancel, packageEvents.create];
    }
  }

  createEffect(() => {
    const el = previewRef();
    const currentStatus = status();
    const isCustomer = isCustomerView();

    if (!el) return;

    setError("");

    const pkg = {
      ...samplePackage,
      status: currentStatus,
      packageEvents: events(),
      viewerRole: isCustomer ? "CUSTOMER" : "ADMIN",
    };

    const template = isCustomer
      ? defaultBodyTemplate
      : adminBodyDefault;

    el.innerHTML = "";
    el.innerHTML = template(pkg as any);
  });

  const handleRoleButtonClick = (value: boolean) => {
    setIsCustomerView(value);
  }

  const handleStatusButtonClick = (value: PackageEventType) => {
    setStatus(value);
  }

  return (
    <div class="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div class="w-full max-w-5xl flex flex-col items-center gap-4">
        {/* View Buttons */}
        <div class="flex flex-wrap gap-2">
          <For each={roleButtons}>
            {(btn) => <Button
              class={`px-3 py-2 rounded-md border transition ${isCustomerView() === btn.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-100"
                }`}
              onClick={() => handleRoleButtonClick(btn.value)}
            >
              {btn.label}
            </Button>}
          </For>
        </div>

        {/* Status buttons */}
        <div class="flex flex-wrap gap-2">
          <For each={statusButtons}>
            {(btn) => <Button
              class={`px-3 py-2 rounded-md border transition ${status() === btn.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-100"
                }`}
              onClick={() => handleStatusButtonClick(btn.value)}
            >
              {btn.label}
            </Button>}
          </For>
        </div>

        {/* Preview */}
        <div
          ref={setPreviewRef}
          class="w-full h-[500px] md:h-[600px] bg-gray-200 border rounded-lg shadow-sm p-2 overflow-auto"
        />

        <Show when={error()}>
          <pre class="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200 overflow-auto">
            {error()}
          </pre>
        </Show>
      </div>
    </div>
  );
}