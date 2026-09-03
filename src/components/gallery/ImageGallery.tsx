import { For, Show } from "solid-js";

export type GalleryImage = string | { src: string; alt?: string; caption?: string };

type ImageGalleryProps = {
  images: GalleryImage[];
  /** Adds a hover caption strip. Only used where the images carry meaning. */
  captions?: boolean;
  class?: string;
};

const srcOf = (image: GalleryImage) => (typeof image === "string" ? image : image.src);
const altOf = (image: GalleryImage) => (typeof image === "string" ? "" : (image.alt ?? ""));
const captionOf = (image: GalleryImage) =>
  typeof image === "string" ? undefined : image.caption;

/**
 * A mosaic that keeps a strong hero frame at any count: the first image runs
 * tall, the rest fill the column beside it. Every tile shares one aspect
 * discipline so the grid never goes ragged.
 */
export default function ImageGallery(props: ImageGalleryProps) {
  const tile = (image: GalleryImage, extra: string) => (
    <figure class={`group relative overflow-hidden rounded-2xl bg-sand-200 ${extra}`}>
      <img
        src={srcOf(image)}
        alt={altOf(image)}
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)]
               group-hover:scale-[1.06]"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent
               to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <Show when={props.captions && captionOf(image)}>
        <figcaption
          class="pointer-events-none absolute bottom-4 left-5 right-5 translate-y-2 text-sm font-medium
                 text-sand-50 opacity-0 transition-all duration-500 ease-[var(--ease-out-soft)]
                 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {captionOf(image)}
        </figcaption>
      </Show>
    </figure>
  );

  // Three images: one tall frame, two stacked beside it.
  if (props.images.length === 3) {
    return (
      <div
        class={`grid w-full gap-3 md:grid-cols-[1.35fr_1fr] md:grid-rows-2 md:[&>*:first-child]:row-span-2 ${
          props.class ?? ""
        }`}
      >
        {tile(props.images[0], "aspect-[4/3] md:aspect-auto md:min-h-[440px]")}
        {tile(props.images[1], "aspect-[4/3] md:aspect-auto")}
        {tile(props.images[2], "aspect-[4/3] md:aspect-auto")}
      </div>
    );
  }

  return (
    <div
      class={`grid w-full auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[230px] md:grid-cols-4 ${
        props.class ?? ""
      }`}
    >
      <For each={props.images}>
        {(image, i) => {
          const span =
            i() === 0
              ? "col-span-2 row-span-2"
              : i() % 5 === 0
                ? "col-span-2"
                : i() % 3 === 0
                  ? "row-span-2"
                  : "";
          return tile(image, span);
        }}
      </For>
    </div>
  );
}
