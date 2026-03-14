import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, Show } from "solid-js";
import { getCategories } from "~/lib/category";
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

  const [allCategories] = createResource(() => getCategories());
  const [selectedCategoryId, setSelectedCategoryId] = createSignal("All");
  const [allProducts] = createResource(() => getAllProducts());
  const [visibleProducts, setVisibleProducts] = createSignal([]);
  const [selectedProduct, setSelectedProduct] = createSignal(null);
  const [sidebarOpen, setSidebarOpen] = createSignal(false); // mobile sidebar toggle

  // Update visible products
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
          class="sm:hidden p-2 bg-blue-600 rounded"
          onClick={() => setSidebarOpen(!sidebarOpen())}
        >
          ☰
        </button>
      </div>

      <div class="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          class={`bg-gray-50 p-4 flex flex-col gap-2 sm:w-48 sm:flex ${
            sidebarOpen() ? "block absolute z-20 w-48 h-full shadow-lg" : "hidden"
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
            {/* New Product */}
            <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setSelectedProduct(createNewProductTemplate())}
              >
                + New Product
              </button>

              {/* Category Filter */}
              <div class="flex items-center gap-2">
                <label class="font-semibold">Filter by category:</label>
                <select
                  class="border p-1 rounded"
                  value={selectedCategoryId()}
                  onChange={(e) => setSelectedCategoryId(e.currentTarget.value)}
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
    </div>
  );
}