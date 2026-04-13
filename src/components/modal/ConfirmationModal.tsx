import { Show } from "solid-js";
import Button from "../button/Button";
import { AiOutlineCloseCircle } from 'solid-icons/ai'

type ConfirmationModalProps = {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal(props: ConfirmationModalProps) {
  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 text-center"
        onClick={props.onCancel}
      >
        <div
          class="flex flex-col gap-[20px] bg-[var(--color-bg)] rounded-lg shadow-lg max-w-md w-full p-6 relative justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="flex justify-center">
            <AiOutlineCloseCircle size={60} color="var(--color-accent-1)" />
          </div>

          <span class="title !text-center">
            {props.title ?? "Confirm Action"}
          </span>

          <span class="body-2 !text-center">
            {props.message ?? "Are you sure you want to proceed?"}
          </span>

          <div class="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              onClick={props.onCancel}
              class="w-full sm:w-auto px-4 py-2 rounded-lg bg-[var(--color-footer)]/30 text-gray-800 hover:bg-[var(--color-footer)]/20"
            >
              {props.cancelText ?? "Cancel"}
            </Button>
            <Button
              onClick={props.onConfirm}
              class="w-full sm:w-auto px-4 py-2 rounded-lg bg-[var(--color-accent-1)] text-white hover:bg-[var(--color-accent-2)]"
            >
              {props.confirmText ?? "Confirm"}
            </Button>
          </div>
        </div>
      </div>
    </Show>
  );
}
