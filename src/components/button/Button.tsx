import { splitProps, JSX } from "solid-js";

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <button {...rest} class={local.class}>
      {local.children}
    </button>
  );
}