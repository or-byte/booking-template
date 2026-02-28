import { For } from "solid-js";

type ImageGalleryProps = {
  images: string[];
};

export default function ImageGallery(props: ImageGalleryProps) {
  const total = props.images.length;

  // 3-image layout
  if (total === 3) {
    return (
      <div class="grid w-full h-full min-h-0 gap-4 grid-cols-[3fr_2fr] grid-rows-2">
        {/* Left large image */}
        <div class="relative overflow-hidden rounded-xl row-span-2 min-h-0">
          <img
            src={props.images[0]}
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Right column */}
        <div class="relative overflow-hidden rounded-xl min-h-0">
          <img
            src={props.images[1]}
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div class="relative overflow-hidden rounded-xl min-h-0">
          <img
            src={props.images[2]}
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  // 4+ image layout
  function getSpan(index: number) {
    if (index === 0) return "col-span-2 row-span-2";
    if (index % 5 === 0) return "col-span-2 row-span-1";
    if (index % 3 === 0) return "row-span-2";
    return "";
  }

  return (
    <div class="grid w-full grid-cols-2 md:grid-cols-4 gap-4 h-full auto-rows-fr min-h-0">
      <For each={props.images}>
        {(img, i) => (
          <div
            class={`
          relative overflow-hidden rounded-xl
          ${getSpan(i())}
          min-h-0
        `}
          >
            <img
              src={img}
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </For>
    </div>
  );
}