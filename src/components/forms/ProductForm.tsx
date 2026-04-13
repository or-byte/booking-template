import { For, Show } from "solid-js";
import { Product } from "~/lib/product";
import Input from "../input/Input";
import Button from "../button/Button";

type Category = {
  id: number;
  name: string;
};

type Props = {
  product: Product;
  allCategories: Category[] | undefined;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onProductChange: (product: Product) => void;
};

export default function ProductForm(props: Props) {
  /// HACK: forces props.product.id to be truthy
  const isEditing = () => !!props.product.id;
  const setField = (patch: Partial<Product>) =>
    props.onProductChange({ ...props.product, ...patch });

  return (
    <div class="p-4 border border-[var(--color-border-1)] rounded-[10px] bg-white shadow w-full sm:max-w-md">
      <div class="flex flex-col gap-3">
        <label class="text-left">
          <p class="body-2 font-bold pb-2">Name:</p>
          <Input
            value={props.product.name}
            onInput={(e) => setField({ name: e.currentTarget.value })}
          />
        </label>

        <div class="flex flex flex-col sm:flex-row justify-between gap-2">
          <label class="w-full">
            <p class="body-2 font-bold pb-2 text-left">Price:</p>
            <Input
              type="number"
              step="0.01"
              value={props.product.price}
              onInput={(e) => setField({ price: parseFloat(e.currentTarget.value) })}
            />
          </label>

          <label class="w-full">
            <p class="body-2 font-bold pb-2 text-left">Category:</p>
            <select
              class="border border-slate-200 p-3 rounded-[10px] w-full appearance-none hover:cursor-pointer"
              value={props.product.categoryId}
              onChange={(e) => setField({ categoryId: Number(e.currentTarget.value) })}
            >
              <option value="" disabled>Select category</option>
              <For each={props.allCategories}>
                {(cat) => <option value={cat.id}>{cat.name}</option>}
              </For>
            </select>
          </label>
        </div>

        <label>
          <p class="body-2 font-bold pb-2 text-left">Description:</p>
          <Input
            value={props.product.description}
            onInput={(e) => setField({ description: e.currentTarget.value })}
          />
        </label>

        <div class="flex flex-col gap-2 mt-2">
          <Button
            class="btn"
            onClick={props.onSave}
          >
            Save Product
          </Button>
          <Show when={isEditing() && props.onDelete}>
            <Button
              class="py-2 px-6 bg-red-500 rounded-[10px] hover:cursor-pointer hover:bg-red-300 text-white"
              onClick={props.onDelete}
            >
              Delete Product
            </Button>
          </Show>
          <Button
            class="py-2 px-6 bg-[#D6D6D6] rounded-[10px] hover:cursor-pointer hover:bg-[#E3E3E3]"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}