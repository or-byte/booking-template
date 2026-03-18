import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, Show } from "solid-js";
import ProposalSection from "~/components/admin/ProposalSection";
import { getCategories, createNewCategory, Category } from "~/lib/category";
import { createPackage, getAllPackages, Package, PackageFormData, PackageItem, PackageItemFormData, updatePackage, UpdatePackageFormData } from "~/lib/package";
import { createNewProduct, deleteProduct, getAllProducts, updateProduct } from "~/lib/product";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = createSignal("packages");
  const navigate = useNavigate();
  const goTo = (path: string) => navigate(path);

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "packages", label: "Packages" },
  ];

  // Categories
  const [allCategories, { mutate: setAllCategories }] = createResource(() => getCategories());
  const [selectedCategoryId, setSelectedCategoryId] = createSignal("All");

  // Products
  const [allProducts] = createResource(() => getAllProducts());
  const [visibleProducts, setVisibleProducts] = createSignal([]);
  const [selectedProduct, setSelectedProduct] = createSignal();

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  // Create category modal
  const [categoryModalOpen, setCategoryModalOpen] = createSignal(false);
  const [newCategoryName, setNewCategoryName] = createSignal("");
  const [newCategoryDesc, setNewCategoryDesc] = createSignal("");

  // Update visible products whenever category or products change
  createEffect(() => {
    if (!allProducts()) return;
    const selectedId = selectedCategoryId();
    if (selectedId === "All") setVisibleProducts(allProducts());
    else
      setVisibleProducts(
        allProducts().filter((p) => String(p.categoryId) === String(selectedId))
      );
  });

  const createNewProductTemplate = () => ({
    id: null,
    name: "",
    sku: "",
    description: "",
    price: 0,
    stockQty: 0,
    categoryId: selectedCategoryId() === "All" ? null : Number(selectedCategoryId()),
  });

  const handleCreateCategory = async () => {
    if (!newCategoryName().trim()) return alert("Category name cannot be empty.");
    try {
      const newCat: Category = await createNewCategory({
        name: newCategoryName(),
        description: newCategoryDesc(),
      });
      setAllCategories((prev) => [...(prev || []), newCat]);
      setSelectedCategoryId(newCat.id);
      setNewCategoryName("");
      setNewCategoryDesc("");
      setCategoryModalOpen(false);
      alert("Category created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create category.");
    }
  };

  const handleSaveProduct = async () => {
    const product = selectedProduct();
    if (!product) return;

    try {
      let savedProduct;
      if (product.id) {
        savedProduct = await updateProduct(product);
        setVisibleProducts((prev) =>
          prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
        );
      } else {
        savedProduct = await createNewProduct(product);
        setVisibleProducts((prev) => [...prev, savedProduct]);
      }
      alert(`Product ${product.id ? "updated" : "created"} successfully!`);
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    }
  };

  const handleDeleteProduct = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(selectedProduct().id);
        setVisibleProducts((prev) =>
          prev.filter((p) => p.id !== selectedProduct().id)
        );
        setSelectedProduct(null);
        alert("Product deleted successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to delete product.");
      }
    }
  }

  // Packages states
  const [packages, { refetch: refetchPackages }] = createResource(async () => getAllPackages())
  const [selectedPackage, setSelectedPackage] = createSignal<Package>();
  const [isEditingPackage, setIsEditingPackage] = createSignal();

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
        });
      }
      // CREATE
      else {
        await createPackage({
          createdById: 1,
          description: pkg.description ?? "",
          packageItems: formattedItems,
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
          onClick={[setSidebarOpen, !sidebarOpen()]}
        >
          {sidebarOpen() ? "✕" : "☰"}
        </button>
      </div>

      <div class="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          class={`bg-gray-50 p-4 flex flex-col gap-2 sm:w-48 sm:flex ${sidebarOpen() ? "block absolute z-20 w-48 h-full shadow-lg" : "hidden"
            }`}
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
          <Show when={activeTab() === "dashboard"}>
            <div>Admin Dashboard Content</div>
          </Show>

          {/* Products */}
          <Show when={activeTab() === "products"}>
            {/* Actions */}
            <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div class="flex gap-2">
                <button
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={[setCategoryModalOpen, true]}
                >
                  + New Category
                </button>

                <button
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={[setSelectedProduct, createNewProductTemplate]}
                >
                  + New Product
                </button>
              </div>

              {/* Category Filter */}
              <div class="flex items-center gap-2">
                <label class="font-semibold">Filter by category:</label>
                <select
                  class="border p-1 rounded"
                  value={selectedCategoryId()}
                  onChange={(e) => {
                    setSelectedCategoryId(e.currentTarget.value);
                    setSelectedProduct(undefined);
                  }}
                >
                  <option value="All">All</option>
                  <For each={allCategories()}>
                    {(cat) => <option value={cat.id}>{cat.name}</option>}
                  </For>
                </select>
              </div>
            </div>

            {/* Products List */}
            <Show when={allProducts.loading}>
              <div>Loading products...</div>
            </Show>

            <Show when={!allProducts.loading && visibleProducts()}>
              <For each={visibleProducts()}>
                {(p) => (
                  <div
                    class="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={[setSelectedProduct, p]}
                  >
                    <div class="font-medium">{p.name}</div>
                    <div class="text-sm text-gray-600">SKU: {p.sku}</div>
                  </div>
                )}
              </For>
            </Show>

            {/* Product Editor */}
            <Show when={selectedProduct()}>
              <div class="mt-6 p-4 border rounded bg-white shadow w-full sm:max-w-md">
                <h2 class="text-lg font-semibold mb-2">
                  {selectedProduct().id ? "Edit Product" : "New Product"}:{" "}
                  {selectedProduct().name || "(unnamed)"}
                </h2>
                <div class="flex flex-col gap-3">
                  <label>
                    Name:
                    <input
                      type="text"
                      class="border p-1 rounded w-full"
                      value={selectedProduct().name}
                      onInput={(e) =>
                        setSelectedProduct({ ...selectedProduct(), name: e.currentTarget.value })
                      }
                    />
                  </label>
                  <label>
                    SKU:
                    <input
                      type="text"
                      class="border p-1 rounded w-full"
                      value={selectedProduct().sku}
                      onInput={(e) =>
                        setSelectedProduct({ ...selectedProduct(), sku: e.currentTarget.value })
                      }
                    />
                  </label>
                  <label>
                    Price:
                    <input
                      type="number"
                      step="0.01"
                      class="border p-1 rounded w-full"
                      value={selectedProduct().price}
                      onInput={(e) =>
                        setSelectedProduct({
                          ...selectedProduct(),
                          price: parseFloat(e.currentTarget.value),
                        })
                      }
                    />
                  </label>
                  <label>
                    Description:
                    <textarea
                      class="border p-1 rounded w-full"
                      value={selectedProduct().description}
                      onInput={(e) =>
                        setSelectedProduct({
                          ...selectedProduct(),
                          description: e.currentTarget.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Category:
                    <select
                      class="border p-1 rounded w-full"
                      value={selectedProduct().categoryId}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct(),
                          categoryId: Number(e.currentTarget.value),
                        })
                      }
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      <For each={allCategories()}>
                        {(cat) => <option value={cat.id}>{cat.name}</option>}
                      </For>
                    </select>
                  </label>

                  <div class="flex flex-col sm:flex-row gap-2 mt-2">
                    <button
                      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                      onClick={handleSaveProduct}
                    >
                      Save Product
                    </button>
                    <button
                      class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex-1"
                      onClick={() => setSelectedProduct(undefined)}
                    >
                      Cancel
                    </button>
                    {selectedProduct()?.id && (
                      <button
                        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                        onClick={handleDeleteProduct}
                      >
                        Delete Product
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Show>
          </Show>

          {/* Proposals */}
          <Show when={activeTab() === "packages"}>
            {/* Actions */}
            <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div class="flex gap-2">
                <button
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={[setSelectedPackage, null]}
                >
                  + Create package
                </button>
              </div>
            </div>

            <Show when={!packages.loading}>
              {/* Package Description */}
              <Show when={selectedPackage() !== undefined}>
                <ProposalSection package={selectedPackage()!} onUpdate={refetchPackages} />
              </Show>
              <For each={packages()}>
                {(p) => {
                  const status = p.approvedBy ? "Approved" : p.reviewedBy ? "Reviewed" : "Needs review"

                  return (
                    <div
                      class="p-2 border-b border-gray-200 cursor-default hover:bg-gray-100 grid grid-cols-2"
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


            <Show when={isEditingPackage() && selectedPackage() !== undefined}>
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
                      <div class="w-20 text-center">Qty</div>
                      <div class="w-24 text-center">Price</div>
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

                          {/* Price */}
                          <input
                            type="number"
                            class="border p-1 rounded w-24 text-center"
                            value={item.price}
                            onInput={(e) => {
                              const updated = [...selectedPackage().packageItems];
                              updated[index()].price = Number(e.currentTarget.value);

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

                  <div class="flex flex-col sm:flex-row gap-2 mt-2">
                    <button
                      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                      onClick={handleSavePackage}
                    >
                      Save Package / Modify / Approve
                    </button>
                    <button
                      class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex-1"
                      onClick={() => setSelectedPackage(undefined)}
                    >
                      Cancel
                    </button>
                    {selectedPackage()?.id && (
                      <button
                        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                      >
                        Reject Proposal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Show>

          </Show>
        </div>
      </div>

      {/* Category Modal */}
      <Show when={categoryModalOpen()}>
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
          <div class="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 class="text-lg font-semibold mb-4">Create New Category</h2>
            <input
              type="text"
              placeholder="Category name"
              class="border p-2 rounded w-full mb-2"
              value={newCategoryName()}
              onInput={(e) => setNewCategoryName(e.currentTarget.value)}
            />
            <textarea
              placeholder="Description (optional)"
              class="border p-2 rounded w-full mb-4"
              value={newCategoryDesc()}
              onInput={(e) => setNewCategoryDesc(e.currentTarget.value)}
            />
            <div class="flex justify-end gap-2">
              <button
                class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={[setCategoryModalOpen, false]}
              >
                Cancel
              </button>
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleCreateCategory}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}