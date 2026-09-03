import { JSX, Show } from "solid-js";
import { A } from "@solidjs/router";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  /** Centre the block instead of running it flush left. */
  align?: "left" | "center";
  /** Invert for use over dark backgrounds. */
  tone?: "dark" | "light";
  class?: string;
  children?: JSX.Element;
};

export default function SectionHeading(props: SectionHeadingProps) {
  const centered = () => props.align === "center";
  const light = () => props.tone === "light";

  return (
    <Reveal
      class={`flex flex-col ${centered() ? "items-center text-center" : "items-start text-left"} ${
        props.class ?? ""
      }`}
    >
      <Show when={props.eyebrow}>
        <span class={light() ? "eyebrow-light" : "eyebrow"}>{props.eyebrow}</span>
      </Show>

      <h2
        class={`mt-3 max-w-3xl font-display ${
          light() ? "text-sand-50" : "text-navy-900"
        }`}
      >
        {props.title}
      </h2>

      {/* A short gold rule reads as a signature mark across the site. */}
      <span
        class={`mt-5 h-px w-14 ${light() ? "bg-gold-300/70" : "bg-gold-400"}`}
        aria-hidden="true"
      />

      <Show when={props.description}>
        <p
          class={`mt-5 max-w-2xl text-base leading-relaxed md:text-lg ${
            light() ? "text-sand-200/80" : "text-navy-700/80"
          }`}
        >
          {props.description}
        </p>
      </Show>

      <Show when={props.linkHref && props.linkLabel}>
        <A
          href={props.linkHref!}
          class={`link-arrow mt-7 ${light() ? "text-sand-100 hover:text-gold-300" : ""}`}
        >
          {props.linkLabel}
        </A>
      </Show>

      {props.children}
    </Reveal>
  );
}
