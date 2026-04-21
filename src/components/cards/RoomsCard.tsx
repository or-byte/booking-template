import { createSignal, For, JSX } from "solid-js";

const roomImagePlaceholder = "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=";

export type RoomsCardItem = {
  id: string | number;
  name: string
  image: string;
  price: string;
};

type RoomsCardProps<T> = {
  items: T[];
  renderContent: (item: T, isActive: boolean) => JSX.Element;
  defaultActive?: number;
  expandedFlex?: number;     // default: 4
  collapsedFlex?: number;    // default: 1.6 (wider collapsed cards)
  class?: string;
};

export default function RoomsCard<T extends RoomsCardItem>(
  props: RoomsCardProps<T>
) {
  const [active, setActive] = createSignal(
    props.defaultActive ?? 0
  );

  const expanded = () => props.expandedFlex ?? 4;
  const collapsed = () => props.collapsedFlex ?? 1.6;

  return (
    <div
      class={`
        w-full
        flex flex-col md:flex-row
        gap-4 md:gap-6
        h-auto md:h-[420px]
        ${props.class ?? ""}
      `}
    >
      <For each={props.items}>
        {(item, index) => {
          const isActive = () => active() === index();

          return (
            <div
              onMouseEnter={() => setActive(index())}
              onClick={() => setActive(index())} // mobile support
              class={`
                relative
                rounded-2xl
                overflow-hidden
                cursor-pointer
                transition-all duration-500 ease-in-out
                h-[200px] md:h-full
              `}
              style={{
                flex:
                  typeof window !== "undefined" &&
                  window.innerWidth >= 768
                    ? isActive()
                      ? expanded().toString()
                      : collapsed().toString()
                    : undefined,
              }}
            >
              {/* Background */}
              {/* images[] is never empty because, by default, Product will return a placeholder image */}
              <img
                src={item.image ?? roomImagePlaceholder }
                alt={""}
                class="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />

              {/* Overlay */}
              <div class="absolute inset-0 bg-black/30" />

              {/* Custom Content */}
              <div class="absolute inset-0">
                {props.renderContent(item, isActive())}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}