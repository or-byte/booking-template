import { For, Show } from "solid-js";
import { Package, calculatePrice } from "~/lib/package";
import { Product } from "~/lib/product";
import Input from "~/components/input/Input";
import Button from "~/components/button/Button";

type PanelMode = "create" | "edit";

type Props = {
  package: Package | null;
  mode: PanelMode;
  allProducts: Product[];
  onSave: () => void;
  onCancel: () => void;
  onPackageChange: (pkg: Package) => void;
};

const modeConfig = {
  create: { title: "New Package",  saveLabel: "Create" },
  edit:   { title: "Edit Package", saveLabel: "Save" },
};

const emptyPackage: Package = {
  description: "",
  packageItems: [],
  overridePrice: 0,
} as Package;

export default function PackageForm(props: Props) {
  const config = () => modeConfig[props.mode];
  const pkg = () => props.package ?? emptyPackage;

  const setField = (patch: Partial<Package>) =>
    props.onPackageChange({ ...pkg(), ...patch } as Package);

  const updateItem = (index: number, patch: object) => {
    const updated = [...pkg().packageItems];
    updated[index] = { ...updated[index], ...patch };
    setField({ packageItems: updated });
  };

  return (
    <div class="p-4 border border-[var(--color-border-1)] rounded-[10px] bg-white shadow w-full sm:max-w-md">
      <div class="flex flex-col gap-3">

        {/* Title */}
        <p class="body-2 font-bold text-left">{config().title}</p>

        {/* Description */}
        <label class="text-left">
          <p class="body-2 font-bold pb-2">Description:</p>
          <Input
            value={pkg().description ?? ""}
            onInput={(e) => setField({ description: e.currentTarget.value })}
          />
        </label>

        {/* Items */}
        <label class="flex flex-col gap-2">
          <div class="flex gap-2 items-center text-left body-2 font-bold px-1">
            <div class="flex-1">Product</div>
            <div class="w-24">Quantity</div>
            <div class="w-8"></div>
          </div>

          <For each={pkg().packageItems}>
            {(item, index) => (
              <div class="flex gap-2 items-center my-2">
                <select
                  class="border border-slate-200 p-3 rounded-[10px] w-full appearance-none hover:cursor-pointer"
                  value={item.productId}
                  onChange={(e) => {
                    const productId = Number(e.currentTarget.value);
                    const product = props.allProducts?.find(p => p.id === productId);
                    updateItem(index(), {
                      productId,
                      price: Number(product?.price ?? 0),
                    });
                  }}
                >
                  <option value="">Select product</option>
                  <For each={props.allProducts}>
                    {(p) => <option value={p.id}>{p.name} (₱{p.price})</option>}
                  </For>
                </select>

                <Input
                  type="number"
                  value={item.quantity}
                  onInput={(e) => updateItem(index(), { quantity: Number(e.currentTarget.value) })}
                />

                <Button
                  class="text-red-500 w-8 hover:cursor-pointer"
                  onClick={() =>
                    setField({ packageItems: pkg().packageItems.filter((_, i) => i !== index()) })
                  }
                >
                  ✕
                </Button>
              </div>
            )}
          </For>

          <Button
            class="text-[var(--color-accent-1)] text-left hover:cursor-pointer hover:underline"
            onClick={() =>
              setField({
                packageItems: [...pkg().packageItems, { productId: 0, quantity: 1, price: 0 }],
              })
            }
          >
            + Add Item
          </Button>
        </label>

        {/* Pricing */}
        <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
          <Show when={props.package}>
            <span class="body-2 font-bold text-left">Total Price:</span>
            <p class="body-2 text-left">₱{calculatePrice(pkg())}</p>
          </Show>

          <span class="body-2 font-bold">Override Price:</span>
          <div class="w-fit">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={pkg().overridePrice ?? 0}
              onInput={(e) => {
                const numeric = e.currentTarget.value === "" ? 0 : parseFloat(e.currentTarget.value);
                setField({ overridePrice: numeric });
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div class="flex flex-col sm:flex-row gap-2 mt-2">
          <Button class="btn w-full" onClick={props.onSave}>
            {config().saveLabel}
          </Button>
          <Button
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 rounded-[10px] w-full"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
        </div>

      </div>
    </div>
  );
}