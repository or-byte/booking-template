import { Title } from "@solidjs/meta";
import ProposalDetails from "~/components/admin/ProposalDetails";
import { createResource, createSignal, For, Show, createEffect } from "solid-js";
import { createPackage, getAllPackages, Package, updatePackage } from "~/lib/package";
import { getAllProducts, Product } from "~/lib/product";
import { useSearchParams } from "@solidjs/router";
import PackageCard from "~/components/cards/PackageCard";
import Button from "~/components/button/Button";
import Input from "~/components/input/Input";
import SearchInput from "~/components/search/SearchInput";

export default function Packages() {
  const [searchParams] = useSearchParams();

  // Products states
  const [allProducts] = createResource<Product[]>(() => getAllProducts());

  // Packages states
  const [packages, { refetch: refetchPackages }] = createResource(async () => getAllPackages())
  const [selectedPackage, setSelectedPackage] = createSignal<Package | null>(null);
  const [isEditingPackage, setIsEditingPackage] = createSignal();

  //Status for package
  type PackageStatus = "Created" | "Approved" | "Reviewed" | "Pending";
  const statusStyles: Record<PackageStatus, string> = {
    Created: "bg-gray-100 text-gray-600",
    Approved: "bg-green-100 text-green-700",
    Reviewed: "bg-yellow-100 text-yellow-700",
    Pending: "bg-blue-100 text-blue-700",
  };

  // Auto-select package from URL param
  createEffect(() => {
    const id = searchParams.id;
    const pkgs = packages();
    if (!id || !pkgs) return;

    const pkg = pkgs.find(p => p.id === Number(id));
    if (pkg) {
      setSelectedPackage(pkg);
      setIsEditingPackage(false);
    }
  });

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

      setSelectedPackage(null);
      refetchPackages();
    } catch (err) {
      console.error(err);
      alert("Failed to save package");
    }
  };

  const onSelectProduct = (e, index: any) => {
    const productId = Number(e.currentTarget.value);
    const product = allProducts()?.find(p => p.id === productId);
    const updated = [...selectedPackage()!.packageItems];

    console.log(product);

    updated[index] = {
      ...updated[index],
      productId,
      price: Number(product?.price ?? 0),
    };
    setSelectedPackage({ ...selectedPackage()!, packageItems: updated } as Package);
  }

  return (
    <main class="py-8">
      <Title>Packages</Title>

      <p class="title text-left">Packages</p>

      <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-6">
        <div class="flex gap-2">
          <Button
            class="btn"
            onClick={() => {
              setIsEditingPackage(true);
              setSelectedPackage(null);
            }}
          >
            + Create package
          </Button>
        </div>
      </div>
      <div class="flex gap-3 items-start">
        <Show when={!packages.loading}>
          <div class="border border-[var(--color-border-1)] rounded-[10px] divide-y divide-[var(--color-border-1)] w-full">
            <For each={packages()}>
              {(p) => {
                const status = p.approvedBy ? "Approved" : p.reviewedBy ? "Reviewed" : "Created";
                return (
                  // <div class={`p-2 border-b border-gray-200 ${selectedPackage()?.id === p.id ? "cursor-default" : "cursor-pointer"} hover:bg-gray-100 grid grid-cols-2`}>
                  //   <div onClick={() => {
                  //     setSelectedPackage(p);
                  //     setIsEditingPackage(false);
                  //   }}>
                  //     <div class="font-medium">{p.id} {p.createdBy.fullName}</div>
                  //     <div class="text-sm text-gray-600">Description: {p.description}</div>
                  //     <div class="text-sm text-gray-600">Status: {status}</div>
                  //   </div>
                  //   <div>
                  //     <div
                  //       class="self-center justify-self-end cursor-pointer"
                  //       onClick={() => {
                  //         setSelectedPackage(p);
                  //         setIsEditingPackage(true);
                  //       }}
                  //     >
                  //       Edit
                  //     </div>
                  //   </div>
                  // </div>
                  <PackageCard
                    name={p.description}
                    onEdit={() => {
                      setSelectedPackage(p);
                      setIsEditingPackage(true)
                    }}
                    onClick={() => {
                      setSelectedPackage(p)
                      setIsEditingPackage(false);
                    }}
                  >
                    <div class="flex items-center gap-2">
                      <p>Status: </p>
                      <span
                        class={`rounded-full px-3 py-0.5 text-sm font-medium ${statusStyles[status]}`}
                      >
                        {status}
                      </span>
                    </div>
                  </PackageCard>
                );
              }}
            </For>
          </div>
          {/* Package Description */}
          <Show when={selectedPackage() !== undefined}>
            <Show when={!isEditingPackage()}>
              <ProposalDetails package={selectedPackage()!} onUpdate={refetchPackages} onEdit={toggleEditPackage} />
            </Show>
            <Show when={isEditingPackage()}>
              {/* Package Editor */}
              <div class="p-4 border border-[var(--color-border-1)] rounded-[10px] bg-white shadow w-full sm:max-w-md">
                <div class="flex flex-col gap-3">
                  <label class="text-left">
                    <p class="body-2 font-bold pb-2">Description:</p>
                    {/* <textarea
                      class="border p-1 rounded w-full"
                      value={selectedPackage()?.description ?? " "}
                      onInput={(e) =>
                        setSelectedPackage({
                          ...selectedPackage(),
                          description: e.currentTarget.value,
                        } as Package)
                      }
                    /> */}
                    <Input
                      value={selectedPackage()?.description ?? " "}
                      onInput={(e) => {
                        setSelectedPackage({
                          ...selectedPackage(),
                          description: e.currentTarget.value,
                        } as Package)
                      }}
                    />
                  </label>
                  <label class="flex flex-col gap-2">
                    {/* HEADER */}
                    <div class="flex gap-2 items-center text-left body-2 font-bold px-1">
                      <div class="flex-1">Product</div>
                      <div class="w-24">Quantity</div>
                      <div class="w-8"></div>
                    </div>

                    {/* ITEMS */}
                    <For each={selectedPackage()?.packageItems}>
                      {(item, index) => (
                        <div class="flex gap-2 items-center mb-2">

                          {/* Select Product */}
                          <select
                            class="border border-slate-200 p-3 rounded-[10px] w-full appearance-none hover:cursor-pointer"
                            value={item.productId}
                            onChange={(e) => {
                              const productId = Number(e.currentTarget.value);
                              const product = allProducts()?.find(p => p.id === productId);
                              const updated = [...selectedPackage()!.packageItems];
                              updated[index()] = {
                                ...updated[index()],
                                productId,
                                price: Number(product?.price ?? 0),
                              };
                              setSelectedPackage({ ...selectedPackage()!, packageItems: updated } as Package);
                            }}
                          >
                            <option value="">Select product</option>
                            <For each={allProducts()}>
                              {(p) => (
                                <option value={p.id}>{p.name} (₱{p.price})</option>
                              )}
                            </For>
                          </select>

                          {/* Quantity */}
                          <div>
                            <Input
                              type="number"
                              value={item.quantity}
                              onInput={(e) => {
                                const updated = [...selectedPackage()!.packageItems];
                                updated[index()].quantity = Number(e.currentTarget.value);
                                setSelectedPackage({ ...selectedPackage()!, packageItems: updated } as Package);
                              }}
                            />
                          </div>

                          {/* Remove */}
                          <Button
                            class="text-red-500 w-8 hover:cursor-pointer"
                            onClick={() => {
                              const updated = selectedPackage()!.packageItems.filter((_, i) => i !== index());
                              setSelectedPackage({ ...selectedPackage()!, packageItems: updated } as Package);
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      )}
                    </For>

                    {/* Add Paackage Item */}
                    <Button
                      class="text-[var(--color-accent-1)] text-left"
                      onClick={() => {
                        setSelectedPackage({
                          ...selectedPackage()!,
                          packageItems: [
                            ...(selectedPackage()?.packageItems || []),
                            { productId: 0, quantity: 1, price: 0 },
                          ],
                        } as Package);
                      }}
                    >
                      + Add Item
                    </Button>
                  </label>

                  {/* PACKAGE PRICE */}
                  <label class="flex items-center gap-2">
                    <span class="body-2 font-bold">Override Price:</span>
                    <div class="w-fit">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={selectedPackage()?.overridePrice ?? 0}
                        onInput={(e) => {
                          const value = e.currentTarget.value;
                          setSelectedPackage({
                            ...selectedPackage()!,
                            overridePrice: value === "" ? 0 : parseFloat(value),
                          } as Package);
                        }}
                      />
                    </div>
                  </label>

                  <div class="flex flex-col sm:flex-row gap-2 mt-2">
                    <Button
                      class="btn w-full"
                      onClick={handleSavePackage}
                    >
                      Save
                    </Button>
                    <Button
                      class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 rounded-[10px] w-full"
                      onClick={() => setSelectedPackage(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Show>
          </Show>
        </Show>
      </div>
    </main>
  );
}