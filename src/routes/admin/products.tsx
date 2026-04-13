import { Title } from "@solidjs/meta";
import { createEffect, createResource, createSignal, For, Show, Switch, Match } from "solid-js";
import { Category, createNewCategory, getCategories } from "~/lib/category";
import { createNewProduct, deleteProduct, EditableProduct, getAllProducts, Product, updateProduct } from "~/lib/product";
import Button from "~/components/button/Button";
import PackageCard from "~/components/cards/PackageCard";
import ProductForm from "~/components/forms/ProductForm";
import CategoryForm from "~/components/forms/CategoryForm";
import ConfirmationModal from "~/components/modal/ConfirmationModal";

export default function Products() {
  // Categories states
  const [allCategories, { mutate: setAllCategories }] = createResource<Category[]>(() => getCategories());
  const [selectedCategoryId, setSelectedCategoryId] = createSignal(null);

  //Confirm Delete modal state
  const [isOpen, setIsOpen] = createSignal(false);

  //success message state for add, update, and delete
  const [message, setMessage] = createSignal<{ text: string; type: "success" | "error" } | null>(null);

  // Products states
  const [allProducts] = createResource<Product[]>(() => getAllProducts());
  const [visibleProducts, setVisibleProducts] = createSignal<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = createSignal<EditableProduct | undefined>();

  // Create category modal
  const [newCategoryName, setNewCategoryName] = createSignal("");
  const [newCategoryDesc, setNewCategoryDesc] = createSignal("");

  //Forms mode
  type ProductForm = "new-category" | "new-product" | "edit";
  const [formMode, setFormMode] = createSignal<ProductForm | null>(null);

  createEffect(() => {
    const products = allProducts();
    if (!products) return;

    const selectedId = selectedCategoryId();

    if (selectedId === "All") {
      setVisibleProducts(products);
    } else {
      setVisibleProducts(
        products.filter((p) => String(p.categoryId) === String(selectedId))
      );
    }
  });

  const createNewProductTemplate = (): EditableProduct => ({
    name: "",
    description: "",
    price: 0,
    stockQty: 0,
    categoryId: selectedCategoryId() === "All" ? undefined : Number(selectedCategoryId()),
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
        setSelectedCategoryId(String(product.categoryId))
        setVisibleProducts((prev) => [...prev, savedProduct]);
      }
      showMessage(`Product ${product.id ? "updated" : "created"} successfully!`);
      setFormMode(null);
    } catch (err) {
      console.error(err);
      showMessage("Something went wrong. Please try again.", "error");
      setFormMode(null);
    }
  };

  const handleDeleteProduct = async () => {
    const product = selectedProduct();
    if (!product) return;

    try {
      await deleteProduct(product.id);
      setVisibleProducts((prev) =>
        prev.filter((p) => p.id !== product.id)
      );
      setFormMode(null);
      setSelectedProduct(undefined);
      onToggleOpen();
      showMessage("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      showMessage("Something went wrong. Please try again.", "error");
      setFormMode(null);
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
      setSelectedCategoryId(String(newCat.id));
      setNewCategoryName("");
      setNewCategoryDesc("");
      setFormMode(null);
      showMessage("Category created successfully!");
    } catch (err) {
      console.error(err);
      showMessage("Something went wrong. Please try again.", "error");
      setFormMode(null);
    }
  };

  const onClickNewProduct = () => {
    setSelectedProduct(createNewProductTemplate());
    setFormMode("new-product");
  };

  const onClickCategory = (id: string) => {
    setSelectedCategoryId(id);
    setSelectedProduct(undefined);
  }

  const onClickCard = (product: Product, mode: ProductForm) => {
    setSelectedProduct(product);
    setFormMode(mode);
  }

  const onToggleOpen = () => {
    setIsOpen(!isOpen())
  }

  const onClickDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    onToggleOpen();
  }

  const closePanel = () => {
    setFormMode(null);
  }

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <main class="py-8">
      <Title>Products</Title>
      <p class="title text-left my-5">Products</p>
      <div class="mb-4 flex flex-col gap-2">
        <div class="flex flex-wrap gap-2">
          <Button
            class="btn"
            onClick={[setFormMode, "new-category"]}
          >
            + New Category
          </Button>

          <Button
            class="btn"
            onClick={onClickNewProduct}
          >
            + New Product
          </Button>
        </div>

        <Show when={message()}>
          <div
            class={`mt-4 p-3 rounded-[10px] text-sm text-left ${message()?.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
              }`}
          >
            {message()?.text}
          </div>
        </Show>

        {/* Category Filter */}
        <div class="flex flex-col gap-5 my-5">
          <p class="subheader-1 text-left">Categories</p>
          <div class="flex flex-wrap gap-2">
            <For each={allCategories()}>
              {(cat) => (
                <Button
                  class="btn-outline"
                  classList={{ active: String(cat.id) === selectedCategoryId() }}
                  onClick={() => onClickCategory(String(cat.id))}
                >
                  {cat.name}
                </Button>
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Products List */}
      <Show when={allProducts.loading}>
        <div>Loading products...</div>
      </Show>

      <div class="flex flex-col sm:flex-row gap-3 items-start">
        <Show when={!allProducts.loading && selectedCategoryId() !== null}>
          <div class={`w-full ${visibleProducts().length > 0 ? "border border-[var(--color-border-1)] rounded-[10px] divide-y divide-[var(--color-border-1)]" : ""}`}>
            <For each={visibleProducts()}>
              {(p) => (
                <PackageCard
                  name={p.name}
                  onClick={() => onClickCard(p, "edit")}
                  onDelete={() => onClickDeleteModal(p)}>
                  <div class="flex items-center gap-2">
                    <p>Description: </p>
                    <p>{p.description}</p>
                  </div>
                </PackageCard>
              )}
            </For>
          </div>
        </Show>

        <Show when={formMode() !== null}>
          <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-60 px-5"
            onClick={closePanel}
          >
            <div class="w-full max-w-md max-h-[90vh] overflow-y-auto px-5" onClick={(e) => e.stopPropagation()}>
              <Switch>
                <Match when={formMode() === "new-category"}>
                  <CategoryForm
                    name={newCategoryName()}
                    description={newCategoryDesc()}
                    onNameChange={setNewCategoryName}
                    onDescriptionChange={setNewCategoryDesc}
                    onConfirm={handleCreateCategory}
                    onCancel={closePanel}
                  />
                </Match>
                <Match when={formMode() === "edit" || formMode() === "new-product"}>
                  {/* Product Editor */}
                  <ProductForm
                    product={selectedProduct()!}
                    allCategories={allCategories()}
                    onSave={handleSaveProduct}
                    onCancel={closePanel}
                    onDelete={selectedProduct()?.id ? handleDeleteProduct : undefined}
                    onProductChange={setSelectedProduct}
                  />
                </Match>
              </Switch>
            </div>
          </div>
        </Show>
      </div>
      <ConfirmationModal
        isOpen={isOpen()}
        title="Delete Item?"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteProduct}
        onCancel={onToggleOpen}
      />
    </main>
  );
}
