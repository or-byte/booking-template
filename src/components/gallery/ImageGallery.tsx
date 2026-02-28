import { For } from "solid-js";

type ImageGalleryProps = {
  images: string[];
};

export default function ImageGallery(props: ImageGalleryProps) {
  function getSpan(index: number) {
    if (index === 0) return "col-span-2 row-span-2";
    if (index % 5 === 0) return "col-span-2 row-span-1";
    if (index % 3 === 0) return "row-span-2";
    return "";
  }

  return (
    <div
      class="
        grid 
        grid-cols-2 md:grid-cols-4 
        auto-rows-[200px] 
        gap-4 
        grid-flow-row-dense
      "
    >
      <For each={props.images}>
        {(img, i) => (
          <div
            class={`
              relative overflow-hidden rounded-xl
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