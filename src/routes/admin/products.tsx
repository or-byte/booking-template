import { Title } from "@solidjs/meta";
import { createEffect, createResource, createSignal, For, Show, Switch, Match } from "solid-js";
import { Category, createNewCategory, getCategories } from "~/lib/category";
import { createNewProduct, deleteProduct, EditableProduct, getAllProducts, Product, updateProduct } from "~/lib/product";
import Button from "~/components/button/Button";
import PackageCard from "~/components/cards/PackageCard";
import ProductForm from "~/components/forms/ProductForm";
import CategoryForm from "~/components/forms/CategoryForm";

export default function Products() {
  // Categories states
  const [allCategories, { mutate: setAllCategories }] = createResource<Category[]>(() => getCategories());
  const [selectedCategoryId, setSelectedCategoryId] = createSignal("All");

  // Products states
  const [allProducts] = createResource<Product[]>(() => getAllProducts());
  const [visibleProducts, setVisibleProducts] = createSignal<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = createSignal<EditableProduct | undefined>();

  // Create category modal
  const [categoryModalOpen, setCategoryModalOpen] = createSignal(false);
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
    sku: "",
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
    const product = selectedProduct();
    if (!product) return;

    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(product.id);
        setVisibleProducts((prev) =>
          prev.filter((p) => p.id !== product.id)
        );
        setSelectedProduct(null);
        alert("Product deleted successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to delete product.");
      }
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

  const onClickCard = (product: Product, mode: ProductForm) => {
    setSelectedProduct(product);
    setFormMode(mode);
  }

  return (
    <main class="py-8">
      <Title>Products</Title>
      <p class="title text-left my-5">Products</p>
      <div class="mb-4 flex flex-col gap-2">
        <div class="flex gap-2">
          <Button
            class="btn"
            onClick={[setFormMode, "new-category"]}
          >
            + New Category
          </Button>

          <Button
            class="btn"
            onClick={[setSelectedProduct, createNewProductTemplate]}
          >
            + New Product
          </Button>
        </div>

        {/* Category Filter */}
        <div class="flex flex-col gap-5 my-5">
          <p class="subheader-1 text-left">Categories</p>
          <div class="flex gap-2">
            <For each={allCategories()}>
              {(cat) =>
                <Button class="btn-outline">
                  {cat.name}
                </Button>}
            </For>
          </div>
        </div>
      </div>

      {/* Products List */}
      <Show when={allProducts.loading}>
        <div>Loading products...</div>
      </Show>

      <div class="flex flex-col sm:flex-row gap-3 items-start">
        <Show when={!allProducts.loading && visibleProducts()}>
          <div class="border border-[var(--color-border-1)] rounded-[10px] divide-y divide-[var(--color-border-1)] w-full">
            <For each={visibleProducts()}>
              {(p) => (
                <PackageCard
                  name={p.name}
                  onClick={() => onClickCard(p, "edit")}>
                  <div class="flex items-center gap-2">
                    <p>Description: </p>
                    <p>{p.description}</p>
                  </div>
                </PackageCard>
              )}
            </For>
          </div>
        </Show>

        <Switch>
          <Match when={formMode() === "new-category"}>
            <CategoryForm
              onConfirm={(name, desc) => handleCreateCategory(name, desc)}
              onCancel={() => setFormMode(null)}
            />
          </Match>
          <Match when={formMode() === "edit" || formMode() === "new-product"}>
            {/* Product Editor */}
            <ProductForm
              product={selectedProduct()!}
              allCategories={allCategories()}
              onSave={handleSaveProduct}
              onCancel={() => setSelectedProduct(undefined)}
              onDelete={selectedProduct()?.id ? handleDeleteProduct : undefined}
              onProductChange={setSelectedProduct}
            />
          </Match>
        </Switch>
      </div>
    </main>
  );
}
