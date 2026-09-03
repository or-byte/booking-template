import { For, JSX, Show } from "solid-js";
import { A } from "@solidjs/router";
import Icon from "~/components/ui/Icon";

type BookingRoomCardProps = {
  image: string;
  title: string;
  priceLabel?: string;
  description?: string;
  capacity?: number;
  size?: string;
  bed?: string;
  view?: string;
  features?: string[];
  /** Flips the photograph to the right, for alternating rows. */
  reversed?: boolean;
  href?: string;
  class?: string;
};

/**
 * One room, presented as a full-width editorial row: photograph on one side,
 * the details that decide a booking on the other. Rows alternate sides down the
 * page so the eye is pulled through the list.
 */
export default function BookingRoomCard(props: BookingRoomCardProps): JSX.Element {
  const meta = () =>
    [
      props.capacity ? { icon: "users" as const, label: `Up to ${props.capacity} guests` } : null,
      props.bed ? { icon: "bed" as const, label: props.bed } : null,
      props.size ? { icon: "expand" as const, label: props.size } : null,
      props.view ? { icon: "beach" as const, label: props.view } : null,
    ].filter(Boolean) as { icon: "users" | "bed" | "expand" | "beach"; label: string }[];

  return (
    <article
      class={`group grid overflow-hidden rounded-3xl border border-sand-300/70 bg-white
              shadow-[var(--shadow-card)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]
              md:grid-cols-2 ${props.class ?? ""}`}
    >
      {/* Photograph */}
      <div
        class={`relative h-64 overflow-hidden md:h-auto md:min-h-[420px] ${
          props.reversed ? "md:order-2" : ""
        }`}
      >
        <img
          src={props.image}
          alt={props.title}
          loading="lazy"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms]
                 ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
        />
        <Show when={props.view}>
          <span
            class="absolute left-4 top-4 rounded-full bg-navy-950/60 px-3.5 py-1.5 text-[11px]
                   font-semibold uppercase tracking-[0.14em] text-sand-50 backdrop-blur-sm"
          >
            {props.view}
          </span>
        </Show>
      </div>

      {/* Detail */}
      <div class="flex flex-col justify-center gap-6 p-7 sm:p-10">
        <div>
          <h3 class="font-display text-navy-900">{props.title}</h3>
          <Show when={props.description}>
            <p class="mt-3 max-w-md leading-relaxed text-navy-700/80">{props.description}</p>
          </Show>
        </div>

        <Show when={meta().length}>
          <ul class="flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-navy-700">
            <For each={meta()}>
              {(item) => (
                <li class="flex items-center gap-2">
                  <Icon name={item.icon} size={16} class="text-gold-600" />
                  {item.label}
                </li>
              )}
            </For>
          </ul>
        </Show>

        <Show when={props.features?.length}>
          <>
            <div class="hairline" />
            <ul class="flex flex-wrap gap-2">
              <For each={props.features}>
                {(feature) => (
                  <li
                    class="rounded-full border border-sand-300 bg-sand-100/70 px-3 py-1.5
                           text-xs tracking-wide text-navy-700"
                  >
                    {feature}
                  </li>
                )}
              </For>
            </ul>
          </>
        </Show>

        <div class="flex flex-wrap items-end justify-between gap-4 pt-1">
          <Show when={props.priceLabel}>
            <p class="leading-none">
              <span class="block text-[11px] uppercase tracking-[0.18em] text-navy-600/70">
                From
              </span>
              <span class="mt-1.5 block font-display text-3xl text-navy-900">
                {props.priceLabel}
              </span>
              <span class="mt-1 block text-xs text-navy-600/70">per night</span>
            </p>
          </Show>

          <A href={props.href ?? "/contact"} class="btn-outline">
            Reserve
          </A>
        </div>
      </div>
    </article>
  );
}
