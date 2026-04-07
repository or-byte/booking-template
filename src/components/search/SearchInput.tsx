import Input, { InputProps } from "../input/Input";
import { JSX, splitProps, Show, createSignal } from "solid-js";

type DropdownProps = InputProps & {
  children?: JSX.Element;
  open?: boolean;
};

export default function SearchInput(props: DropdownProps) {
  const [local, inputProps] = splitProps(props, ["children"]);
  const [focused, setFocused] = createSignal(false);

  return (
    <div
      class="relative"
      onFocusIn={() => setFocused(true)}
      onFocusOut={() => setTimeout(() => setFocused(false), 150)}
    >
      <Input {...inputProps} />

      <Show when={props.open && focused()}>
        <div class="absolute top-full left-0 w-full bg-white shadow-md rounded-[10px] mt-1 z-50">
          {props.children}
        </div>
      </Show>
    </div>
  );
}