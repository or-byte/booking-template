import { createUniqueId, Show, splitProps, type JSX } from "solid-js";

type InputProps = {
  label: string;
  /** Renders a multi-line control instead of a single-line input. */
  multiline?: boolean;
  rows?: number;
  error?: boolean;
  class?: string;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

/**
 * A floating-label field: the label sits inside the control so a stacked form
 * reads as one column of even blocks, with no separate label row to align.
 */
export default function Input(props: InputProps) {
  const [local, rest] = splitProps(props, [
    "label",
    "multiline",
    "rows",
    "error",
    "class",
  ]);
  const id = createUniqueId();

  const shell = () =>
    `flex flex-col gap-1 rounded-xl border bg-white px-4 pb-2.5 pt-3 transition-all duration-200
     focus-within:border-navy-800 focus-within:ring-4 focus-within:ring-navy-900/5
     ${local.error ? "border-red-400 bg-red-50/40" : "border-sand-300"}`;

  const control =
    "w-full bg-transparent text-sm text-navy-900 outline-none placeholder:text-navy-400/60";

  return (
    <div class={`w-full ${local.class ?? ""}`}>
      <div class={shell()}>
        <label
          for={id}
          class="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-600/70"
        >
          {local.label}
        </label>

        <Show
          when={local.multiline}
          fallback={<input id={id} class={control} {...rest} />}
        >
          <textarea
            id={id}
            rows={local.rows ?? 4}
            class={`${control} resize-none`}
            {...(rest as unknown as JSX.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        </Show>
      </div>
    </div>
  );
}
