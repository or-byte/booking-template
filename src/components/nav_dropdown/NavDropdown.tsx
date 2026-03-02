import { JSX } from "solid-js";
import Button from "../button/Button";

type NavDropdownProps = {
  label: string;
  children: JSX.Element;
};

export default function NavDropdown(props: NavDropdownProps) {
  return (
    <div class="relative group">
      {/* Trigger */}
      <Button
        class="
          px-4 py-2
          font-medium
          text-neutral-700
          hover:text-black
          transition-colors duration-200
        "
      >
        {props.label}
      </Button>

      {/* Dropdown Panel */}
      <div
        class="
          absolute left-1/2 -translate-x-1/2
          mt-3
          w-56
          rounded-xl
          bg-white
          shadow-xl
          ring-1 ring-black/5
          opacity-0
          translate-y-2
          pointer-events-none
          transition-all duration-200
          group-hover:opacity-100
          group-hover:translate-y-0
          group-hover:pointer-events-auto
        "
      >
        <div class="py-2">
          {props.children}
        </div>
      </div>
    </div>
  );
}