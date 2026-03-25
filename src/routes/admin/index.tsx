import { useNavigate } from "@solidjs/router";
import { createResource, createSignal, For, Match, Show, Switch } from "solid-js";
import ProposalDetails from "~/components/admin/ProposalDetails";
import { createPackage, getAllPackages, Package, updatePackage } from "~/lib/package";
import { getAllProducts } from "~/lib/product";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = createSignal("packages");
  const navigate = useNavigate();
  const goTo = (path: string) => navigate(path);

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "packages", label: "Packages" },
  ];

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen());
  }

  // Product
  const [allProducts] = createResource(() => getAllProducts());

  // Packages states
  const [packages, { refetch: refetchPackages }] = createResource(async () => getAllPackages())
  const [selectedPackage, setSelectedPackage] = createSignal<Package | null>();
  const [isEditingPackage, setIsEditingPackage] = createSignal();

  const toggleEditPackage = () => {
    setIsEditingPackage(!isEditingPackage());
  }

  const handleSavePackage = async () => {
    try {
      const pkg = selectedPackage();
      if (!pkg) return;

      const formattedItems = (pkg.packageItems || []).map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      // UPDATE
      if (pkg.id) {
        await updatePackage(pkg.id, {
          description: pkg.description ?? "",
          packageItems: formattedItems,
          updatedById: 1, // TODO replace with current user session
          overridePrice: pkg.overridePrice
        });
      }
      // CREATE
      else {
        await createPackage({
          createdById: 1,
          description: pkg.description ?? "",
          packageItems: formattedItems,
          overridePrice: pkg.overridePrice
        });
      }

      setSelectedPackage(undefined);
      refetchPackages();
    } catch (err) {
      console.error(err);
      alert("Failed to save package");
    }
  };

  return (
    <div class="flex flex-col h-screen">
      {/* Top Navbar */}
      <div class="h-16 bg-blue-400 text-white flex items-center px-4 sm:px-6 shadow justify-between">
        <div class="flex items-center gap-4">
          <img
            src="/images/waterfront_logo.png"
            alt="logo"
            class="cursor-pointer w-[60px] sm:w-[90px] transition-all"
            onClick={[goTo, "/"]}
          />
          <h1 class="text-xl font-bold hidden sm:block">Admin Panel</h1>
        </div>

        {/* Mobile sidebar toggle */}
        <button
          class="sm:hidden p-2"
          onClick={toggleSidebar}
        >
          {sidebarOpen() ? "✕" : "☰"}
        </button>
      </div>

      <div class="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          class={`bg-gray-50 p-4 flex flex-col gap-2 sm:w-48 sm:flex ${sidebarOpen() ? "block absolute z-20 w-48 h-full shadow-lg" : "hidden"}`}
        >
          {tabs.map((tab) => (
            <button
              class={[
                "p-3 rounded text-left flex items-center gap-2 transition-colors duration-200 w-full",
                activeTab() === tab.id
                  ? "bg-blue-300 text-blue-900 font-semibold"
                  : "hover:bg-gray-100 text-gray-700",
              ].join(" ")}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div class="flex-1 p-4 sm:p-6 overflow-auto">
          {/* Dashboard */}
          <Switch fallback={<div>No active tab</div>}>
            <Match when={activeTab() === "dashboard"}>
              <div>Admin Dashboard Content</div>
            </Match>

            {/* Products */}
            <Match when={activeTab() === "products"}>
              <div> Products Content </div>
            </Match>

            {/* Proposals */}
            <Match when={activeTab() === "packages"}>
              {/* Actions */}
              <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div class="flex gap-2">
                  <button
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => {
                      setIsEditingPackage(true);
                      setSelectedPackage(null);
                    }}
                  >
                    + Create package
                  </button>
                </div>
              </div>

              <Show when={!packages.loading}>
                {/* Package Description */}
                <Show when={selectedPackage() !== undefined}>
                  <Show when={!isEditingPackage()}>
                    <ProposalDetails package={selectedPackage()!} onUpdate={refetchPackages} onEdit={toggleEditPackage} />
                  </Show>
                  <Show when={isEditingPackage()}>
                    {/* Package Editor */}
                    <div class="mt-6 p-4 border rounded bg-white shadow w-full sm:max-w-md">
                      <h2 class="text-lg font-semibold mb-2">
                        {selectedPackage()?.id ? "Edit Package" : "New Package"}:{" "}
                      </h2>
                      <div class="flex flex-col gap-3">
                        <label>
                          Description:
                          <textarea
                            class="border p-1 rounded w-full"
                            value={selectedPackage()?.description ?? " "}
                            onInput={(e) =>
                              setSelectedPackage({
                                ...selectedPackage(),
                                description: e.currentTarget.value,
                              })
                            }
                          />
                        </label>
                        <label class="flex flex-col gap-2">
                          <span class="font-semibold">Products:</span>

                          {/* HEADER */}
                          <div class="flex gap-2 items-center text-sm font-semibold text-gray-600 px-1">
                            <div class="flex-1">Product</div>
                            <div class="w-24 text-center">Quantity</div>
                            <div class="w-8"></div>
                          </div>

                          {/* ITEMS */}
                          <For each={selectedPackage()?.packageItems}>
                            {(item, index) => (
                              <div class="flex gap-2 items-center mb-2">

                                {/* Select Product */}
                                <select
                                  class="border p-1 rounded flex-1"
                                  value={item.productId}
                                  onChange={(e) => {
                                    const productId = Number(e.currentTarget.value);
                                    const product = allProducts()?.find(p => p.id === productId);

                                    const updated = [...selectedPackage().packageItems];
                                    updated[index()] = {
                                      ...updated[index()],
                                      productId,
                                      price: Number(product?.price ?? 0),
                                    };

                                    setSelectedPackage({
                                      ...selectedPackage(),
                                      packageItems: updated,
                                    });
                                  }}
                                >
                                  <option value="">Select product</option>
                                  <For each={allProducts()}>
                                    {(p) => (
                                      <option value={p.id}>
                                        {p.name} (₱{p.price})
                                      </option>
                                    )}
                                  </For>
                                </select>

                                {/* Quantity */}
                                <input
                                  type="number"
                                  class="border p-1 rounded w-20 text-center"
                                  value={item.quantity}
                                  onInput={(e) => {
                                    const updated = [...selectedPackage().packageItems];
                                    updated[index()].quantity = Number(e.currentTarget.value);

                                    setSelectedPackage({
                                      ...selectedPackage(),
                                      packageItems: updated,
                                    });
                                  }}
                                />

                                {/* Remove */}
                                <button
                                  class="text-red-500 w-8"
                                  onClick={() => {
                                    const updated = selectedPackage().packageItems.filter(
                                      (_, i) => i !== index()
                                    );

                                    setSelectedPackage({
                                      ...selectedPackage(),
                                      packageItems: updated,
                                    });
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </For>

                          {/* Add Paackage Item */}
                          <button
                            class="mt-2 bg-green-500 text-white px-3 py-1 rounded w-fit"
                            onClick={() => {
                              setSelectedPackage({
                                ...selectedPackage(),
                                packageItems: [
                                  ...(selectedPackage()?.packageItems || []),
                                  {
                                    productId: 0,
                                    quantity: 1,
                                    price: 0,
                                  },
                                ],
                              });
                            }}
                          >
                            + Add Item
                          </button>
                        </label>

                        {}

                        {/* PACKAGE PRICE */}
                        <label class="flex items-center gap-2">
                          <span class="font-semibold">Override Price:</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            class="border p-1 rounded w-24 text-center"
                            value={selectedPackage()?.overridePrice ?? 0}
                            onInput={(e) => {
                              const value = e.currentTarget.value;
                              setSelectedPackage({
                                ...selectedPackage(),
                                overridePrice: value === "" ? 0 : parseFloat(value),
                              });
                            }}
                          />
                        </label>

                        <div class="flex flex-col sm:flex-row gap-2 mt-2">
                          <button
                            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                            onClick={handleSavePackage}
                          >
                            Save
                          </button>
                          <button
                            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex-1"
                            onClick={() => setSelectedPackage(undefined)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </Show>
                </Show>

                {/* Packages List */}
                <For each={packages()}>
                  {(p) => {
                    const status = p.approvedBy ? "Approved" : p.reviewedBy ? "Reviewed" : "Needs review"

                    return (
                      <div
                        class={`p-2 border-b border-gray-200 ${selectedPackage()?.id === p.id ? "cursor-default" : "cursor-pointer"} hover:bg-gray-100 grid grid-cols-2`}
                      >
                        <div onClick={() => {
                          setSelectedPackage(p)
                          setIsEditingPackage(false);
                        }}>
                          <div class="font-medium">{p.id} {p.createdBy.fullName}</div>
                          <div class="text-sm text-gray-600">Description: {p.description}</div>
                          <div class="text-sm text-gray-600">Status: {status}</div>
                        </div>
                        <div>
                          <div class="self-center justify-self-end cursor-pointer"
                            onClick={() => {
                              setSelectedPackage(p);
                              setIsEditingPackage(true);
                            }}>
                            Edit
                          </div>
                        </div>
                      </div>
                    )
                  }}
                </For>
              </Show>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}