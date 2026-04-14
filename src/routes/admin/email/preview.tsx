import { createSignal, Show, onMount, createEffect } from "solid-js";
import Button from "~/components/button/Button";
import defaultBodyTemplate from "~/lib/google/templates/default";
import { Package, PACKAGE_EVENT_DESCRIPTION, PackageEvent, PackageEventType } from "~/lib/package";
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
    description: PACKAGE_EVENT_DESCRIPTION.create,
    createdAt: new Date("2026-04-10T09:00:00"),
    type: PackageEventType.CREATED,
    createdById: "u1",
    createdBy: users.customer,
  },
  modify: {
    id: 2,
    description: PACKAGE_EVENT_DESCRIPTION.modify,
    createdAt: new Date("2026-04-10T10:15:00"),
    type: PackageEventType.MODIFIED,
    createdById: "u2",
    createdBy: users.staff,
  },
  review: {
    id: 3,
    description: PACKAGE_EVENT_DESCRIPTION.review,
    createdAt: new Date("2026-04-11T08:30:00"),
    type: PackageEventType.REVIEWED,
    createdById: "u3",
    createdBy: users.staff,
  },
  approve: {
    id: 4,
    description: PACKAGE_EVENT_DESCRIPTION.approve,
    createdAt: new Date("2026-04-11T11:45:00"),
    type: PackageEventType.APPROVED,
    createdById: "u2",
    createdBy: users.admin,
  },
  reject: {
    id: 5,
    description: PACKAGE_EVENT_DESCRIPTION.reject,
    createdAt: new Date("2026-04-11T11:45:00"),
    type: PackageEventType.REJECTED,
    createdById: "u2",
    createdBy: users.admin,
  },
  cancel: {
    id: 6,
    description: PACKAGE_EVENT_DESCRIPTION.cancel,
    createdAt: new Date("2026-04-11T11:45:00"),
    type: PackageEventType.CANCELLED,
    createdById: "u2",
    createdBy: users.admin,
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

const statusButtons: { label: string; value: PackageEventType }[] = [
  { label: "Created", value: PackageEventType.CREATED },
  { label: "Modified", value: PackageEventType.MODIFIED },
  { label: "Reviewed", value: PackageEventType.REVIEWED },
  { label: "Approved", value: PackageEventType.APPROVED },
  { label: "Rejected", value: PackageEventType.REJECTED },
  { label: "Cancelled", value: PackageEventType.CANCELLED },
];

export default function EmailPreview() {
  const [error, setError] = createSignal("");
  const [status, setStatus] = createSignal<PackageEventType>(samplePackage.status);
  const events = () => {
    switch (status()) {
      case PackageEventType.CREATED:
        return [packageEvents.create];
      case PackageEventType.MODIFIED:
        return [packageEvents.create, packageEvents.modify];
      case PackageEventType.REVIEWED:
        return [packageEvents.create, packageEvents.review];
      case PackageEventType.APPROVED:
        return [packageEvents.create, packageEvents.review, packageEvents.approve];
      case PackageEventType.REJECTED:
        return [packageEvents.create, packageEvents.review, packageEvents.reject];
      case PackageEventType.CANCELLED:
        return [packageEvents.create, packageEvents.cancel];
    }
  }

  let previewRef: HTMLDivElement | undefined;

  const runPreviewWithStatus = (currentStatus: PackageEventType) => {
    try {
      setError("");
      if (!previewRef) return;

      const sortedEvents = [...(events() ?? [])].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );

      const pkg = {
        ...samplePackage,
        status: currentStatus,
        packageEvents: sortedEvents,
      };

      const html = defaultBodyTemplate(pkg as any);
      previewRef.innerHTML = html;
    } catch (e: any) {
      setError(e.message);
    }
  };

  createEffect(() => {
    runPreviewWithStatus(status());
  });

  return (
    <div class="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div class="w-full max-w-5xl flex flex-col items-center gap-4">

        {/* Status buttons */}
        <div class="flex flex-wrap gap-2">
          {statusButtons.map((btn) => (
            <Button
              class={`px-3 py-2 rounded-md border transition ${status() === btn.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-gray-100"
                }`}
              onClick={() => setStatus(btn.value)}
            >
              {btn.label}
            </Button>
          ))}
        </div>

        {/* Preview */}
        <div
          ref={previewRef}
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