import { createSignal, createEffect, onCleanup } from "solid-js";

type ImageProps = {
  image: string;
  class?: string;
  alt?: string;
};

export default function Image(props: ImageProps) {
  const serverOrigin = import.meta.env.VITE_API_BASE_URL;
  const [src, setSrc] = createSignal<string | null>(null);

  createEffect(() => {
    if (!props.image) return;

    const evtSource = new EventSource(
      `${serverOrigin}/images/${props.image}/sse`
    );

    let hasPreview = false;
    let hasFull = false;

    evtSource.onmessage = (e) => {
      if (e.data.startsWith("preview:") && !hasPreview) {
        setSrc(serverOrigin + e.data.substring(8));
        hasPreview = true;
      } else if (e.data.startsWith("full:") && !hasFull) {
        setTimeout(() => {
          setSrc(serverOrigin + e.data.substring(5));
          hasFull = true;
          evtSource.close();
        }, 1000);
      }
    };

    onCleanup(() => evtSource.close());
  });

  return (
    <img
      src={src() ?? ""}
      alt={props.alt ?? "Image"}
      class={props.class ?? "rounded-lg"}
    />
  );
}
