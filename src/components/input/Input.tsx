import type { JSX } from "solid-js";

type InputProps = {
  label?: string;
  class?: string;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  const { label, class: className = "", ...rest } = props;
  return (
    <div class="flex flex-col gap-1 rounded-[10px] px-4 pt-3 pb-2 border border-slate-200 w-full">
      <label class="text-xs font-semibold text-left">{label}</label>
      <input
        class={`bg-transparent outline-none placeholder:text-slate-400 text-sm pb-1 w-full ${className}`}
        {...rest}
      />
    </div>
  );
}