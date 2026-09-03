import { createSignal, For, JSX, Show } from "solid-js";
import Icon from "~/components/ui/Icon";

export type RoomsCardItem = {
  id: string | number;
  name: string;
  price: number | string;
  image?: string;
  description?: string;
};

type RoomsCardProps<T> = {
  items: T[] | undefined;
  renderContent: (item: T, isActive: boolean) => JSX.Element;
  defaultActive?: number;
  /** Flex grow for the open panel. */
  expandedFlex?: number;
  /** Flex grow for the panels either side of it. */
  collapsedFlex?: number;
  fallbackImage?: string;
  class?: string;
};

/**
 * A horizontal accordion of room photographs: one panel open, the rest folded
 * back. Widths are driven by inline flex-grow rather than a media query in
 * JavaScript, so the layout is correct in the server-rendered HTML and stays
 * correct when the window is resized — the whole row simply stacks under the
 * `md` breakpoint, where `flex-grow` has no effect on a column.
 */
export default function RoomsCard<T extends RoomsCardItem>(props: RoomsCardProps<T>) {
  const [active, setActive] = createSignal(props.defaultActive ?? 0);

  const expanded = () => props.expandedFlex ?? 3.4;
  const collapsed = () => props.collapsedFlex ?? 1;

  return (
    <div
      class={`flex w-full flex-col gap-4 md:h-[520px] md:flex-row md:gap-3 ${props.class ?? ""}`}
    >
      <For each={props.items}>
        {(item, index) => {
          const isActive = () => active() === index();

          return (
            <button
              type="button"
              onMouseEnter={() => setActive(index())}
              onFocus={() => setActive(index())}
              onClick={() => setActive(index())}
              aria-label={item.name}
              aria-expanded={isActive()}
              class="group relative h-[300px] cursor-pointer overflow-hidden rounded-2xl text-left
                     transition-[flex-grow] duration-700 ease-[var(--ease-out-soft)] md:h-full"
              style={{ "flex-grow": isActive() ? expanded() : collapsed(), "flex-basis": "0%" }}
            >
              <img
                src={item.image ?? props.fallbackImage}
                alt={item.name}
                loading="lazy"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms]
                       ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
              />

              {/* Folded panels sit back; the open one clears so the photo reads. */}
              <div
                class={`absolute inset-0 transition-all duration-700 ${
                  isActive()
                    ? "bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent"
                    : "bg-navy-950/55 backdrop-saturate-[0.85]"
                }`}
              />

              <div class="absolute inset-0">{props.renderContent(item, isActive())}</div>

              {/* Affordance on the folded panels only. */}
              <Show when={!isActive()}>
                <span
                  class="absolute right-4 top-4 hidden h-8 w-8 place-items-center rounded-full
                         border border-white/40 text-white/80 md:grid"
                  aria-hidden="true"
                >
                  <Icon name="expand" size={14} />
                </span>
              </Show>
            </button>
          );
        }}
      </For>
    </div>
  );
}
