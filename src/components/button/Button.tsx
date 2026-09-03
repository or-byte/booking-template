import { splitProps, type JSX } from "solid-js";

type ButtonProps = {
  children: JSX.Element;
  /** Visual weight. Maps to the button recipes in app.css. */
  variant?: "primary" | "gold" | "outline" | "ghost-light";
  class?: string;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

const variants = {
  primary: "btn-primary",
  gold: "btn-gold",
  outline: "btn-outline",
  "ghost-light": "btn-ghost-light",
} as const;

export default function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["children", "variant", "class"]);

  return (
    <button
      type="button"
      {...rest}
      class={`${variants[local.variant ?? "primary"]} ${local.class ?? ""}`}
    >
      {local.children}
    </button>
  );
}
