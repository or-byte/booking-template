import { Show } from "solid-js";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  /** Object position for the photograph, e.g. "center 30%". */
  focus?: string;
};

/**
 * The banner every interior page opens with. Shorter than the home hero — it
 * establishes place and hands over to the content quickly.
 */
export default function PageHero(props: PageHeroProps) {
  return (
    <section class="relative isolate flex min-h-[46vh] items-end overflow-hidden md:min-h-[58vh]">
      <img
        src={props.image}
        alt=""
        class="absolute inset-0 -z-20 h-full w-full object-cover"
        style={{ "object-position": props.focus ?? "center" }}
      />
      <div class="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/90 via-navy-950/55 to-navy-950/40" />

      <div class="shell pb-14 pt-32 md:pb-20">
        <Show when={props.eyebrow}>
          <span class="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-gold-300">
            <span class="h-px w-8 bg-gold-300/70" aria-hidden="true" />
            {props.eyebrow}
          </span>
        </Show>

        <h1 class="mt-5 max-w-3xl font-display text-sand-50">{props.title}</h1>

        <Show when={props.description}>
          <p class="mt-5 max-w-xl text-base leading-relaxed text-sand-100/80 md:text-lg">
            {props.description}
          </p>
        </Show>
      </div>
    </section>
  );
}
