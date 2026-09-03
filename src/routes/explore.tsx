import { Meta, Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For } from "solid-js";
import ImageGallery from "~/components/gallery/ImageGallery";
import PageHero from "~/components/ui/PageHero";
import Reveal from "~/components/ui/Reveal";
import SectionHeading from "~/components/ui/SectionHeading";
import Icon from "~/components/ui/Icon";
import { amenities, dining, experiences, photos, site } from "~/data/site";

const facilities = [
  {
    name: "Infinity pool",
    detail: "Twenty metres, sea-facing, heated in the cool months. Open 6 AM to 10 PM.",
    image: photos.pool,
  },
  {
    name: "Seaside cabanas",
    detail: "Massage and treatments in open-sided cabanas at the north end of the beach.",
    image: photos.spa,
  },
  {
    name: "Events pavilion",
    detail: "A covered pavilion on the lawn for weddings and retreats of up to 120 guests.",
    image: photos.resort,
  },
];

export default function Explore() {
  return (
    <main>
      <Title>Explore — {site.name}</Title>
      <Meta
        name="description"
        content="Dining at El Mar, the pool and cabanas, and the Bataan coastline around the resort."
      />

      <PageHero
        eyebrow="The resort"
        title="Explore"
        description="What there is to do here, and what is worth the drive when you feel like leaving."
        image={photos.pool}
      />

      {/* --- Dining -------------------------------------------------------- */}
      <section id="dining" class="section bg-sand-50">
        <div class="shell">
          <div class="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div class="lg:col-span-7">
              <SectionHeading
                eyebrow={dining.kicker}
                title={dining.name}
                description={dining.description}
              />
            </div>

            <Reveal delay={120} class="lg:col-span-5">
              <dl class="rounded-2xl border border-sand-300/80 bg-white p-7 shadow-[var(--shadow-card)]">
                <p class="eyebrow">Service hours</p>
                <div class="mt-5 space-y-3.5">
                  <For each={dining.hours}>
                    {(row) => (
                      <div class="flex items-baseline justify-between gap-4 text-sm">
                        <dt class="text-navy-800">{row.label}</dt>
                        <span class="h-px flex-1 bg-sand-300" aria-hidden="true" />
                        <dd class="tabular-nums text-navy-600/80">{row.value}</dd>
                      </div>
                    )}
                  </For>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal delay={140} class="mt-12">
            <ImageGallery
              captions
              images={[
                { src: photos.dining[0], alt: "Dining terrace", caption: "The terrace at golden hour" },
                { src: photos.dining[1], alt: "Dining room", caption: "Indoor dining room" },
                { src: photos.dining[2], alt: "Beach bar", caption: "Beach bar, open until midnight" },
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* --- Facilities ---------------------------------------------------- */}
      <section id="facilities" class="section bg-white">
        <div class="shell">
          <SectionHeading
            eyebrow="On the property"
            title="Facilities"
            description="Everything below is on site and open to every guest."
          />

          <div class="mt-14 space-y-6">
            <For each={facilities}>
              {(item, i) => (
                <Reveal delay={i() * 90}>
                  <article
                    class={`group grid overflow-hidden rounded-3xl border border-sand-300/70 bg-sand-50
                            md:grid-cols-2 ${i() % 2 === 1 ? "md:[&>figure]:order-2" : ""}`}
                  >
                    <figure class="relative h-60 overflow-hidden md:h-auto md:min-h-[320px]">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover transition-transform
                               duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                      />
                    </figure>
                    <div class="flex flex-col justify-center gap-4 p-8 sm:p-12">
                      <h3 class="font-display text-3xl text-navy-900">{item.name}</h3>
                      <p class="max-w-md leading-relaxed text-navy-700/80">{item.detail}</p>
                    </div>
                  </article>
                </Reveal>
              )}
            </For>
          </div>

          {/* The full amenity list, as a compact index. */}
          <Reveal delay={120} class="mt-14 rounded-2xl border border-sand-300/70 bg-sand-50 p-8">
            <p class="eyebrow">Included with every stay</p>
            <ul class="mt-6 grid gap-x-8 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
              <For each={amenities}>
                {(amenity) => (
                  <li class="flex items-center gap-3 text-sm text-navy-800">
                    <Icon name="check" size={15} class="shrink-0 text-gold-600" />
                    {amenity.label}
                  </li>
                )}
              </For>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* --- Attractions --------------------------------------------------- */}
      <section id="attractions" class="section bg-navy-950 text-sand-100">
        <div class="shell">
          <SectionHeading
            eyebrow="Beyond the resort"
            title="Attractions in Bataan"
            description="The front desk arranges transport and guides for any of these with a day's notice."
            tone="light"
          />

          <div class="mt-14 grid gap-6 md:grid-cols-3">
            <For each={experiences}>
              {(item, i) => (
                <Reveal delay={i() * 110}>
                  <article class="group h-full overflow-hidden rounded-2xl border border-white/10 bg-navy-900">
                    <div class="relative h-56 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        class="h-full w-full object-cover transition-transform duration-[1200ms]
                               ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                      />
                    </div>
                    <div class="p-7">
                      <p class="eyebrow-light">{item.distance}</p>
                      <h3 class="mt-3 font-display text-2xl text-sand-50">{item.title}</h3>
                      <p class="mt-3 text-sm leading-relaxed text-sand-300/70">
                        {item.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* --- Gallery ------------------------------------------------------- */}
      <section id="gallery" class="section bg-sand-50">
        <div class="shell">
          <SectionHeading
            eyebrow="Gallery"
            title="The resort, in pictures"
            description="Photographs from around the property and the shoreline in front of it."
          />

          <Reveal delay={120} class="mt-14">
            <ImageGallery
              captions
              images={[
                { src: photos.hero, alt: "Sunset from the beach", caption: "Sunset from the beach" },
                { src: photos.pool, alt: "Pool deck", caption: "Pool deck" },
                { src: photos.rooms[0], alt: "Seaview Deluxe", caption: "Seaview Deluxe" },
                { src: photos.dining[0], alt: "El Mar terrace", caption: "El Mar terrace" },
                { src: photos.shore, alt: "The shoreline", caption: "The shoreline" },
                { src: photos.rooms[3], alt: "Beachfront Suite", caption: "Beachfront Suite" },
                { src: photos.spa, alt: "Seaside cabanas", caption: "Seaside cabanas" },
              ]}
            />
          </Reveal>

          <Reveal delay={160} class="mt-14 text-center">
            <A href="/rooms" class="btn-gold">
              Check availability
            </A>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
