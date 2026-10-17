import { JSX, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";

type RevealProps = {
  children: JSX.Element;
  /** Element to render. Defaults to a plain div. */
  as?: string;
  /** Stagger, in milliseconds, for elements revealed as a group. */
  delay?: number;
  class?: string;
};

/**
 * Releases its children from the `[data-reveal]` rest state once they scroll
 * into view. Rendered markup is identical on the server; the attribute flips
 * only after hydration, so content is never hidden for crawlers or when
 * JavaScript fails to load — `noscript` support comes from the observer simply
 * never running while the base style keeps the element in place.
 */
export default function Reveal(props: RevealProps) {
  let el: HTMLElement | undefined;

  onMount(() => {
    if (!el) return;

    // Older browsers, or a user who prefers reduced motion: show immediately.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.setAttribute("data-reveal", "shown");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).setAttribute("data-reveal", "shown");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    onCleanup(() => observer.disconnect());
  });

  return (
    <Dynamic
      component={props.as ?? "div"}
      ref={el!}
      data-reveal=""
      class={props.class}
      style={props.delay ? { "--reveal-delay": `${props.delay}ms` } : undefined}
    >
      {props.children}
    </Dynamic>
  );
}
