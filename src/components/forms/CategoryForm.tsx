import { createSignal } from "solid-js";

type Props = {
  onConfirm: (name: string, description: string) => void;
  onCancel: () => void;
};

export default function CategoryForm(props: Props) {
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");

  const handleConfirm = () => {
    props.onConfirm(name(), description());
    setName("");
    setDescription("");
  };

  return (
    <div class="p-4 border border-[var(--color-border-1)] rounded-[10px] bg-white shadow w-full sm:max-w-md">
      <p class="subheader-1 font-bold pb-2 text-left">New Category</p>
      <div class="flex flex-col gap-3">
        <label>
          Name:
          <input
            type="text"
            placeholder="Category name"
            class="border p-2 rounded w-full"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            placeholder="Description (optional)"
            class="border p-2 rounded w-full"
            value={description()}
            onInput={(e) => setDescription(e.currentTarget.value)}
          />
        </label>
        <div class="flex gap-2 mt-2">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
            onClick={handleConfirm}
          >
            Create
          </button>
          <button
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex-1"
            onClick={props.onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}