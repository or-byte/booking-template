import { Title } from "@solidjs/meta";
import ProposalDetails from "~/components/admin/ProposalDetails";
import { createResource, createSignal, For, Show, createEffect, Switch, Match } from "solid-js";
import { createPackage, getAllPackages, Package, updatePackage, deletePackage } from "~/lib/package";
import { getAllProducts, Product } from "~/lib/product";
import { useSearchParams } from "@solidjs/router";
import PackageCard from "~/components/cards/PackageCard";
import Button from "~/components/button/Button";
import PackageForm from "~/components/forms/PackageForms";
import { useSession } from "~/lib/auth";

export default function Packages() {
  const session = useSession();
  const [searchParams] = useSearchParams();

  // Products states
  const [allProducts] = createResource<Product[]>(() => getAllProducts());

  // Packages states
  const [page, setPage] = createSignal(1);
  const pageSize = 5;
  const [packages, { refetch: refetchPackages }] = createResource(page, async (page) => (await getAllPackages(page, pageSize)))
  const [selectedPackage, setSelectedPackage] = createSignal<Package | null>(null);

  //Forms mode
  type PackageForm = "readonly" | "create" | "edit";
  const [packageMode, setPackageMode] = createSignal<PackageForm | null>(null);

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

    const pkg = pkgs.data.find(p => p.id === Number(id));
    if (pkg) {
      setSelectedPackage(pkg);
      setPackageMode("readonly");
    }
  });

  const toggleEditPackage = () => {
    setPackageMode("edit");
  }

  const handleSavePackage = async () => {

    const userId = session().data?.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

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
          updatedById: userId,
          overridePrice: pkg.overridePrice
        });
      }
      // CREATE
      else {
        await createPackage({
          companyName: pkg.companyName,
          contactNumber: pkg.contactNumber,
          contactEmail: pkg.contactEmail,
          numberOfGuests: pkg.numberOfGuests,
          eventDate: pkg.eventDate,
          createdById: userId,
          description: pkg.description ?? "",
          packageItems: formattedItems,
          overridePrice: pkg.overridePrice
        });
      }

      setSelectedPackage(null);
      setPackageMode(null);
      await refetchPackages();
    } catch (err) {
      console.error(err);
      alert("Failed to save package");
    }
  };

  const refetchAndSync = async () => {
    await refetchPackages();
    const updated = packages()?.data.find(p => p.id === selectedPackage()?.id);
    if (updated) setSelectedPackage(updated);
  };

  const closePanel = () => {
    setSelectedPackage(null);
    setPackageMode(null);
  };

  const onHandleDelete = async (p: Package) => {
    try {
      await deletePackage(p?.id);
      await refetchPackages();

      if (selectedPackage()?.id === p.id) {
        setSelectedPackage(null);
        setPackageMode(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete package");
    }
  }
  
  const handleSetPage = (page: number) => {
    setPage(page);
  }

  const handleNextPage = () => {
    handleSetPage(page() + 1);
  }

  const handlePrevPage = () => {
    handleSetPage(page() - 1);
  }

  return (
    <main class="py-10">
      <Title>Packages</Title>

      <p class="title text-left">Packages</p>

      <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-6">
        <div class="flex gap-2">
          <Button
            class="btn"
            onClick={() => {
              setPackageMode("create");
              setSelectedPackage(null);
            }}
          >
            + Create package
          </Button>
        </div>
      </div>

      {/* Package List */}
      <div class="flex flex-col sm:flex-row gap-3 items-start">
        <Show when={!packages.loading}>
          <Show when={packages()?.data.length}>
            <div class="border border-[var(--color-border-1)] rounded-[10px] divide-y divide-[var(--color-border-1)] w-full">
              <For each={packages()?.data}>
                {(p) => {
                  const status = p.approvedBy ? "Approved" : p.reviewedBy ? "Reviewed" : "Created";
                  return (
                    <PackageCard
                      name={p.description}
                      onEditShow={true}
                      onEdit={() => {
                        setSelectedPackage(p);
                        setPackageMode("edit")
                      }}
                      onClick={() => {
                        setSelectedPackage(p)
                        setPackageMode("readonly");
                      }}
                      onDelete={() => onHandleDelete(p)}
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
          </Show>
          {/* Package Description */}

          <Show when={packageMode() !== null}>
            <div
              class="fixed inset-0 bg-black/50 flex items-center justify-center z-60 px-5"
              onClick={closePanel}
            >
              <div class="w-full max-w-md max-h-[90vh] overflow-y-auto px-5" onClick={(e) => e.stopPropagation()}>
                <Switch>
                  <Match when={packageMode() === "readonly"}>
                    <ProposalDetails
                      package={selectedPackage()!}
                      onUpdate={refetchAndSync}
                      onEdit={toggleEditPackage}
                      onCancel={() => setSelectedPackage(null)}
                    />
                  </Match>
                  <Match when={packageMode() === "edit" || packageMode() === "create"}>
                    <PackageForm
                      package={selectedPackage()}
                      mode={packageMode() as "create" | "edit"}
                      allProducts={allProducts()}
                      onSave={handleSavePackage}
                      onPackageChange={setSelectedPackage}
                      onCancel={closePanel}
                    />
                  </Match>
                </Switch>
              </div>
            </div>
          </Show>
        </Show>
      </div>

      {/* Page */}
      <Show when={packages()?.meta}>
        <div class="flex justify-center items-center gap-4 mt-6">

          <Button
            class="btn hover:underline hover:cursor-pointer"
            disabled={page() === 1}
            onClick={handlePrevPage}
          >
            Prev
          </Button>

          <span class="text-sm">
            Page {packages()?.meta.page} of {packages()?.meta.totalPages}
          </span>

          <Button
            class="btn hover:underline hover:cursor-pointer"
            disabled={page() === packages()?.meta?.totalPages}
            onClick={handleNextPage}
          >
            Next
          </Button>

        </div>
      </Show>
    </main>
  );
}