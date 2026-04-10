import { createSignal } from "solid-js";
import Input from "../input/Input";
import Button from "../button/Button";

type Props = {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function CategoryForm(props: Props) {
  const handleConfirm = () => {
    props.onConfirm();
    props.onNameChange("");
    props.onDescriptionChange("");
  };
  return (
    <div class="p-4 border border-[var(--color-border-1)] rounded-[10px] bg-white shadow w-full sm:max-w-md">
      <p class="subheader-1 font-bold py-3 mb-4 text-left">New Category</p>
      <div class="flex flex-col gap-3 text-left">
        <label>
          <p class="body-2 font-bold pb-2">Name:</p>
          <Input
            type="text"
            placeholder="Category name"
            value={props.name}
            onInput={(e) => props.onNameChange(e.currentTarget.value)}
          />
        </label>
        <label>
          <p class="body-2 font-bold pb-2">Description:</p>
          <Input
            placeholder="Description (optional)"
            value={props.description}
            onInput={(e) => props.onDescriptionChange(e.currentTarget.value)}
          />
        </label>
        <div class="flex flex-col gap-2 mt-2">
          <Button
            class="btn"
            onClick={handleConfirm}
          >
            Create
          </Button>
          <Button
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded-[10px] hover:bg-gray-400"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}