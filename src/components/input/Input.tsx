import { JSX, createEffect, splitProps } from "solid-js";

type InputProps = {
  label?: string;
  class?: string;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ["label", "class", "value"]);

  let inputRef: HTMLInputElement | undefined;

  // 👇 force sync value → DOM
  createEffect(() => {
    if (inputRef && local.value !== inputRef.value) {
      inputRef.value = (local.value as string) ?? "";
    }
  });

  return (
    <div class="flex flex-col gap-1 rounded-[10px] px-4 pt-3 pb-2 border border-slate-200 w-full">
      <label class="text-xs font-semibold text-left">{local.label}</label>
      <input
        ref={inputRef}
        value={local.value}
        class={`bg-transparent outline-none placeholder:text-slate-400 text-sm pb-1 w-full ${local.class ?? ""}`}
        {...rest}
      />
    </div>
  );
}