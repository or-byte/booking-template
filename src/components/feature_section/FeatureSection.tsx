import { JSX, Show } from "solid-js";
import { A } from "@solidjs/router";

type FeatureSectionProps = {
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  bgClass?: string;
  class?: string;
  children: JSX.Element;
};

export default function FeatureSection(props: FeatureSectionProps) {
  return (
    <section class={`py-20 ${props.bgClass ?? "bg-white"}`}>
      <div class={`flex flex-col mx-4 md:mx-[80px] px-6 ${props.class ?? ""}`}>

        <h2 class="text-3xl font-serif mb-4">
          {props.title}
        </h2>

        <Show when={props.description}>
          <p class="text-gray-600 max-w-2xl mb-6">
            {props.description}
          </p>
        </Show>

        {props.linkHref && props.linkLabel && (
          <A
            href={props.linkHref}
            class="text-sm text-[var(--color-accent-1)] hover:underline mb-8 inline-block"
          >
            {props.linkLabel} →
          </A>
        )}

        <div class="rounded-lg overflow-hidden">
          {props.children}
        </div>

      </div>
    </section>
  );
}