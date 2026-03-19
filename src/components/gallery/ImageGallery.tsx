import { For } from "solid-js";

type ImageGalleryProps = {
  images: string[];
};

export default function ImageGallery(props: ImageGalleryProps) {
  const total = props.images.length;

  // 3-image layout
  if (total === 3) {
    return (
      <div class="
      grid gap-4 w-full
      grid-cols-1
      md:grid-cols-[3fr_2fr] md:grid-rows-2">
        {/* Large Image */}
        <div class="relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-auto md:row-span-2">
          <img
            src={props.images[0]}
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Right Images */}
        <div class="relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-auto">
          <img
            src={props.images[1]}
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div class="relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-auto">
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
    <div class="
      grid gap-4 w-full
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-4
      auto-rows-[200px] md:auto-rows-[220px]
    ">
      <For each={props.images}>
        {(img, i) => (
          <div
            class={`
            relative overflow-hidden rounded-xl
            aspect-[4/3] sm:aspect-auto
            ${getSpan(i())}
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