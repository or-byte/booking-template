import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, Show } from "solid-js";
import { getCategories, createNewCategory, Category } from "~/lib/category";
import { createNewProduct, getAllProducts, updateProduct } from "~/lib/product";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = createSignal("products");
  const navigate = useNavigate();
  const goTo = (path: string) => navigate(path);

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "rooms", label: "Rooms" },
  ];

  // Categories
  const [allCategories, { mutate: setAllCategories }] = createResource(() => getCategories());
  const [selectedCategoryId, setSelectedCategoryId] = createSignal("All");

  // Products
  const [allProducts] = createResource(() => getAllProducts());
  const [visibleProducts, setVisibleProducts] = createSignal([]);
  const [selectedProduct, setSelectedProduct] = createSignal(null);

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
          onClick={() => setSidebarOpen(!sidebarOpen())}
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
                  onClick={() => setSelectedProduct(createNewProductTemplate())}
                >
                  + New Product
                </button>

                <button
                  class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => setCategoryModalOpen(true)}
                >
                  + New Category
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
                    onClick={() => setSelectedProduct(p)}
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
                      onClick={() => setSelectedProduct(null)}
                    >
                      Cancel
                    </button>
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
                onClick={() => setCategoryModalOpen(false)}
              >
                Cancel
              </button>
              <button
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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