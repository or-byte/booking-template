import { Title } from "@solidjs/meta";
import { createSignal, createMemo, createResource, For } from "solid-js";
import Table, { Column } from "~/components/table/Table";
import { MdFillFilter_list } from 'solid-icons/md';
import { getAllProducts, Product, updateProduct } from "~/lib/product";
import { createPackage, getAllPackages, Package, updatePackage, deletePackage } from "~/lib/package";

export const BookingStatus = {
  CHECK_IN: "Check In",
  CHECK_OUT: "Check Out",
  RESERVED: "Reserved",
  CANCELLED: "Cancelled",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export type Booking = {
  id: number;
  guest: string;
  roomType: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
};

export const sampleBookings: Booking[] = [
  {
    id: 1,
    guest: "John Doe",
    roomType: "Deluxe",
    roomNumber: "Room 1",
    checkIn: "03/24/2026",
    checkOut: "03/27/2026",
    status: BookingStatus.CHECK_IN,
  },
  {
    id: 2,
    guest: "Jane Doe",
    roomType: "Standard",
    roomNumber: "Room 2",
    checkIn: "03/24/2026",
    checkOut: "03/27/2026",
    status: BookingStatus.CHECK_IN,
  },
  {
    id: 3,
    guest: "Bob Smith",
    roomType: "Suite",
    roomNumber: "Room 5",
    checkIn: "03/25/2026",
    checkOut: "03/28/2026",
    status: BookingStatus.RESERVED,
  },
  {
    id: 4,
    guest: "Alice Johnson",
    roomType: "Deluxe",
    roomNumber: "Room 3",
    checkIn: "03/20/2026",
    checkOut: "03/23/2026",
    status: BookingStatus.CHECK_OUT,
  },
  {
    id: 5,
    guest: "Carlos Rivera",
    roomType: "Standard",
    roomNumber: "Room 6",
    checkIn: "03/22/2026",
    checkOut: "03/24/2026",
    status: BookingStatus.CANCELLED,
  },
];

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
  { header: "Description", accessor: "description" },
  {
    header: "Override Price",
    accessor: (row) =>
      row.overridePrice !== null ? (
        <span>₱{Number(row.overridePrice).toFixed(2)}</span>
      ) : (
        <span>-</span>
      ),
  },
  { header: "Created By", accessor: "createdById" },
  {
    header: "Reviewed By",
    accessor: (row) => row.reviewedById ?? "-",
  },
  {
    header: "Approved By",
    accessor: (row) => row.approvedById ?? "-",
  },
  {
    header: "Updated By",
    accessor: (row) => row.updatedById ?? "-",
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
  const [bookings, setBookings] = createSignal([...sampleBookings]);

  //Products state
  const [allProducts] = createResource<Product[]>(() => getAllProducts());

  //Packages state
  const [page, setPage] = createSignal(1);
  const pageSize = 5;
  const [packages, { refetch: refetchPackages }] = createResource(page, async (page) => (await getAllPackages(page, pageSize)));
  const totalPages = () => 10;


  const handleStatusChange = (id: number, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setEditingId(null);
  };


  const filteredAndSorted = createMemo(() => {
    let data = [...bookings()];

    // Filter
    if (statusFilter() !== "All") {
      data = data.filter(b => b.status === statusFilter());
    }

    // Sort
    if (sortOrder() === "asc") {
      data.sort((a, b) => a.guest.localeCompare(b.guest));
    } else if (sortOrder() === "desc") {
      data.sort((a, b) => b.guest.localeCompare(a.guest));
    }

    return data;
  });

  const toggleSort = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const columns: Column<Booking>[] = [
    {
      header: "Guest",
      accessor: "guest",
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
    { header: "Room Type", accessor: "roomType" },
    { header: "Room Number", accessor: "roomNumber" },
    { header: "Check In", accessor: "checkIn" },
    { header: "Check Out", accessor: "checkOut" },
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

  return (
    <main class="py-8">
      <Title>Dashboard</Title>
      <p class="title text-left my-5">Dashboard</p>

      <div class="flex flex-col gap-6">
        <Table
          title="Booking List"
          columns={columns}
          data={filteredAndSorted()}
        />

        <Table
          title="Packages"
          columns={packageColumns}
          data={packages() ?? []}
          pagination={{
            page,
            totalPages,
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