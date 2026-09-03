import { A } from "@solidjs/router";
import BookingBar from "~/components/booking/BookingBar";
import { photos, site } from "~/data/site";

export default function Hero() {
  return (
    <section class="relative isolate flex min-h-[100svh] w-full flex-col justify-end overflow-hidden">
      {/* Photograph, on a slow drift so the frame never sits completely still. */}
      <div class="absolute inset-0 -z-20">
        <img
          src={photos.hero}
          alt="Sunset over the West Philippine Sea from the resort shoreline"
          class="h-full w-full animate-ken-burns object-cover object-center"
          fetchpriority="high"
        />
      </div>

      {/* Two scrims rather than one: a vertical wash to seat the type, and a
          warm bottom band that carries the sunset colour into the page. */}
      <div class="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/70 via-navy-950/30 to-navy-950/85" />
      <div class="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-navy-950/70 via-gold-700/10 to-transparent" />

      <div class="shell pb-10 pt-32 md:pb-14">
        <div class="max-w-3xl">
          <span
            class="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-300"
            data-reveal="shown"
          >
            <span class="h-px w-8 bg-gold-300/70" aria-hidden="true" />
            Morong, Bataan
          </span>

          <h1 class="mt-6 font-display text-sand-50 drop-shadow-[0_2px_24px_rgb(5_13_32/0.45)]">
            Sunsets over the{" "}
            <em class="not-italic text-gold-300">West Philippine Sea</em>
          </h1>

          <p class="mt-6 max-w-xl text-base leading-relaxed text-sand-100/85 md:text-lg">
            {site.description}
          </p>

          <div class="mt-9 flex flex-wrap items-center gap-4">
            <A href="/rooms" class="btn-gold">
              Explore Rooms
            </A>
            <A href="/explore" class="btn-ghost-light">
              The Resort
            </A>
          </div>
        </div>

        {/* Availability strip, tucked into the base of the hero. */}
        <BookingBar class="mt-12 md:mt-16" />
      </div>
    </section>
  );
}
