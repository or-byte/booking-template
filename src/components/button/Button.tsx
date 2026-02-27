import type { JSX } from "solid-js";

type ButtonProps = {
    children: JSX.Element;
    class?: string;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
    const { children, class: className, ...rest } = props;
    return (
        <button {...rest} class={className}>
            {children}
        </button>
    );
}