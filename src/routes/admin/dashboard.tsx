import { Title } from "@solidjs/meta";
import { createSignal, createMemo, createResource, For, Show } from "solid-js";
import Table, { Column } from "~/components/table/Table";
import { MdFillFilter_list } from 'solid-icons/md';
import { getAllProducts, Product } from "~/lib/product";
import { getAllPackages, Package } from "~/lib/package";
import { listEvents, createEvent, deleteEvent, getServiceAccountAccessToken } from "~/lib/google/calendar";
import GoogleCalendar from "~/components/calendar/GoogleCalendar";
import Button from "~/components/button/Button";
import PackageCard from "~/components/cards/PackageCard";
import { Booking, BookingStatus, getAllBookings, updateBookingStatus } from "~/lib/booking";

const productColumns: Column<Product>[] = [
  { header: "Name", accessor: "name" },
  { header: "Description", accessor: "description" },
  {
    header: "Price",
    accessor: (row) => <span>₱{Number(row.price).toFixed(2)}</span>,
  },
  { header: "Stock", accessor: "stockQty" },
];

const packageColumns: Column<Package>[] = [
  { header: "ID", accessor: "id" },
  { header: "Title", accessor: "title" },
  {
    header: "Override Price",
    accessor: (row) =>
      row.overridePrice !== null ? (
        <span>₱{Number(row.overridePrice).toFixed(2)}</span>
      ) : (
        <span>-</span>
      ),
  },
  {
    header: "Created At",
    accessor: (row) =>
      new Date(row.createdAt).toLocaleString(),
  },
  {
    header: "Updated At",
    accessor: (row) =>
      new Date(row.updatedAt).toLocaleString(),
  },
];

export default function Dashboard() {
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc" | null>(null);
  const [statusFilter, setStatusFilter] = createSignal("All");
  const [editingId, setEditingId] = createSignal<number | null>(null);

  const [bookings, { mutate: mutateBookings }] = createResource(async () => await getAllBookings());

  //Products state
  const [allProducts] = createResource<Product[]>(() => getAllProducts());

  //Packages state
  const [page, setPage] = createSignal(1);
  const pageSize = 5;
  const [packages, { refetch: refetchPackages }] = createResource(page, async (page) => (await getAllPackages(page, pageSize)));

  //access token state
  const [accessToken] = createResource(getServiceAccountAccessToken);

  //events state
  const [events, { refetch }] = createResource(() => accessToken(), listEvents);

  //success message state for add, update, and delete
  //message() is null when no request is made
  const [message, setMessage] = createSignal<{ text: string; type: "success" | "error" } | null>(null);

  const filteredAndSorted = createMemo(() => {
    let data = bookings();

    if (!data) return;

    // Filter
    if (statusFilter() !== "All") {
      data = data.filter(b => b.status === statusFilter());
    }

    // Sort
    if (sortOrder() === "asc") {
      data.sort((a, b) => a.leadGuestName.localeCompare(b.leadGuestName));
    } else if (sortOrder() === "desc") {
      data.sort((a, b) => b.leadGuestName.localeCompare(a.leadGuestName));
    }

    return data;
  });

  const toggleSort = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const handleStatusChange = async (id: number, status: BookingStatus) => {

    try {
      const res = await updateBookingStatus(id, status);
      const newStatus = res.status
      mutateBookings(prev => prev?.map(b => {
        if (b.id === id)
          return { ...b, status: newStatus };
        else {
          return b;
        }
      }));
    }
    catch (err) {
      console.error(err);
    }
    setEditingId(null);
  };

  const bookingColumn: Column<Booking>[] = [
    {
      header: "Guest",
      accessor: "leadGuestName",
      renderHeader: () => (
        <div class="flex justify-between">
          <span>Guest</span>
          <button
            class="text-[var(--color-footer)] hover:cursor-pointer hover:text-[var(--color-accent-1)]"
            onClick={toggleSort}
          >
            <MdFillFilter_list size={20} />
          </button>
        </div>
      ),
    },
    { header: "Room Name", accessor: "roomName" },
    { header: "Check In", accessor: "checkInDate" },
    { header: "Check Out", accessor: "checkOutDate" },
    {
      header: "Status",
      accessor: (row) => (
        <div class="flex items-center gap-2">
          {editingId() === row.id ? (
            <select
              class="border rounded px-2 py-1 text-xs"
              value={row.status}
              onChange={(e) => handleStatusChange(row.id, e.currentTarget.value as BookingStatus)}
              onBlur={() => setEditingId(null)}
            >
              <For each={Object.values(BookingStatus)}>
                {(s) => <option value={s}>{s}</option>}
              </For>
            </select>
          ) : (
            <>
              <span>{row.status}</span>
              <button
                class="text-xs text-[var(--color-accent-1)] hover:underline hover:cursor-pointer"
                onClick={() => setEditingId(row.id)}
              >
                Edit
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const onCreateEvent = async () => {
    if (!accessToken()) {
      console.error("No access token available");
      return;
    }

    try {
      await createEvent(accessToken(), {
        summary: "Service Account Event test new",
        start: { dateTime: "2026-04-21T09:00:00+08:00" },
        end: { dateTime: "2026-04-21T10:00:00+08:00" },
      });
      refetch();
      showMessage("Event added successfully!");
    } catch (error) {
      console.error(error);
      showMessage("Something went wrong. Please try again.", "error");
    }
  };

  const onDeleteEvent = async (event) => {
    try {
      await deleteEvent(accessToken(), event.id);
      refetch();
      showMessage("Event deleted successfully!");
    } catch (error) {
      console.error(error);
      showMessage("Something went wrong. Please try again.", "error");
    }

  }

  return (
    <main class="py-8">
      <Title>Dashboard</Title>
      <p class="title text-left my-5">Dashboard</p>

      <GoogleCalendar />

      <div class="my-4 flex flex-col gap-5 items-start">
        <Show when={!events.loading} fallback={<p>Loading events...</p>}>
          <div class="border border-[var(--color-border-1)] rounded-[10px] divide-y divide-[var(--color-border-1)] w-full">
            <For each={events()?.items}>
              {(event) => (
                <PackageCard
                  name={event.summary}
                  onEditShow={false}
                  onDelete={() => onDeleteEvent(event)}>
                  <span>{event.start?.dateTime}</span>
                </PackageCard>
              )}
            </For>
          </div>
        </Show>
        <Button class="btn" onClick={onCreateEvent}>Create New Event</Button>
      </div>

      <Show when={message()}>
        <div
          class={`my-4 p-3 rounded-[10px] text-sm text-left ${message()?.type === "error"
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
            }`}
        >
          {message()?.text}
        </div>
      </Show>

      <div class="flex flex-col gap-6">
        <Table
          title="Booking List"
          columns={bookingColumn}
          data={filteredAndSorted()}
        />

        <Table
          title="Packages"
          columns={packageColumns}
          data={packages()?.data}
          pagination={{
            page,
            totalPages: () => packages()?.meta.totalPages ?? 1,
            onNext: () => setPage(p => p + 1),
            onPrev: () => setPage(p => p - 1),
          }}
        />

        <Table
          title="Products"
          columns={productColumns}
          data={allProducts() ?? []}
        />
      </div>
    </main>
  )
}