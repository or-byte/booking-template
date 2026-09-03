import { Title, Meta } from "@solidjs/meta";
import { A, createAsync } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { For, Show, Suspense } from "solid-js";
import Hero from "~/components/hero/HeroSection";
import FeatureSection from "~/components/feature_section/FeatureSection";
import RoomsCard from "~/components/cards/RoomsCard";
import AmenitiesSection from "~/components/amenities/AmenitiesSection";
import ImageGallery from "~/components/gallery/ImageGallery";
import Icon from "~/components/ui/Icon";
import Reveal from "~/components/ui/Reveal";
import SectionHeading from "~/components/ui/SectionHeading";
import { getRooms } from "~/lib/rooms";
import { formatPrice } from "~/utils/price";
import { dining, experiences, glance, photos, site, travel } from "~/data/site";

const MapGoogle = clientOnly(() => import("~/components/map/MapGoogle"));

export default function Home() {
  const rooms = createAsync(() => getRooms());

  return (
    <main>
      <Title>{site.name} — Beachfront resort in Morong, Bataan</Title>
      <Meta name="description" content={site.description} />

      <Hero />

      {/* --- Welcome ------------------------------------------------------ */}
      <section class="section bg-sand-50">
        <div class="shell grid gap-14 lg:grid-cols-12 lg:items-center">
          <div class="lg:col-span-6">
            <SectionHeading
              eyebrow="Welcome"
              title="A small resort on a quiet stretch of the Bataan coast"
              description="We are three hours from Manila and a world away from it. Twenty-four rooms, one restaurant, a pool that faces the water, and a shoreline that empties out by mid-afternoon."
            />

            <Reveal delay={120}>
              <p class="mt-6 max-w-xl leading-relaxed text-navy-700/80">
                The resort has been in the same family since 1998. What has kept
                guests coming back is not a long list of facilities — it is the
                short walk from the room to the sand, and the fact that the
                sunset arrives at the same table every evening.
              </p>

              <A href="/about" class="link-arrow mt-8">
                Our Story
              </A>
            </Reveal>
          </div>

          <Reveal delay={160} class="lg:col-span-6">
            <div class="relative">
              <img
                src={photos.shore}
                alt="The shoreline in front of the resort"
                loading="lazy"
                class="aspect-[4/3] w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
              />
              {/* Inset second frame gives the block depth without a carousel. */}
              <img
                src={photos.pool}
                alt="The pool deck facing the sea"
                loading="lazy"
                class="absolute -bottom-8 -left-6 hidden w-44 rounded-2xl border-4 border-sand-50
                       object-cover shadow-[var(--shadow-lift)] md:block lg:w-56"
              />
            </div>
          </Reveal>
        </div>

        {/* At a glance */}
        <div class="shell mt-20 md:mt-28">
          <div class="hairline" />
          <dl class="grid grid-cols-2 gap-y-10 py-12 lg:grid-cols-4">
            <For each={glance}>
              {(stat, i) => (
                <Reveal delay={i() * 80} class="text-center">
                  <dt class="font-display text-4xl text-navy-900 md:text-5xl">{stat.value}</dt>
                  <dd class="mt-2 text-xs uppercase tracking-[0.16em] text-navy-600/70">
                    {stat.label}
                  </dd>
                </Reveal>
              )}
            </For>
          </dl>
          <div class="hairline" />
        </div>
      </section>

      {/* --- Rooms -------------------------------------------------------- */}
      <FeatureSection
        eyebrow="Stay"
        title="Rooms & Suites"
        description="Four room types, all within sight or a minute's walk of the water. Rates include breakfast for every guest in the room."
        linkHref="/rooms"
        linkLabel="View all rooms"
      >
        <Suspense
          fallback={
            <div class="flex h-[320px] items-center justify-center">
              <span class="spinner" />
            </div>
          }
        >
          <Show when={rooms()}>
            {(list) => (
              <RoomsCard
                items={list()}
                defaultActive={0}
                fallbackImage={photos.rooms[0]}
                renderContent={(room, isActive) => (
                  <div class="absolute inset-x-0 bottom-0 p-6 text-left text-white md:p-7">
                    <p
                      class={`text-[11px] uppercase tracking-[0.18em] transition-all duration-500
                        ${isActive ? "text-gold-300 opacity-100" : "text-sand-200 opacity-70"}`}
                    >
                      From {formatPrice(room.price)}
                    </p>

                    <h3
                      class={`mt-2 font-display transition-all duration-500
                        ${isActive ? "text-3xl md:text-4xl" : "text-xl opacity-85"}`}
                    >
                      {room.name}
                    </h3>

                    {/* The description belongs only to the open panel — the
                        folded ones are too narrow to carry a sentence. */}
                    <div
                      class="grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-soft)]"
                      style={{
                        "grid-template-rows": isActive ? "1fr" : "0fr",
                        opacity: isActive ? "1" : "0",
                      }}
                    >
                      <div class="min-h-0 overflow-hidden">
                        <p class="mt-3 max-w-sm text-sm leading-relaxed text-sand-100/85">
                          {room.description}
                        </p>
                        <span class="link-arrow mt-5 text-sand-50">Reserve</span>
                      </div>
                    </div>
                  </div>
                )}
              />
            )}
          </Show>
        </Suspense>
      </FeatureSection>

      {/* --- Dining ------------------------------------------------------- */}
      <section class="section bg-sand-100">
        <div class="shell">
          <div class="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div class="lg:col-span-7">
              <SectionHeading
                eyebrow={dining.kicker}
                title={`Relax and dine at ${dining.name}`}
                description={dining.description}
                linkHref="/explore#dining"
                linkLabel="See the restaurant"
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

      {/* --- Explore ------------------------------------------------------ */}
      <FeatureSection
        eyebrow="Bataan"
        title="Worth leaving the beach for"
        description="Three things within easy reach of the resort. The front desk arranges transport for all of them."
        linkHref="/explore#attractions"
        linkLabel="All experiences"
      >
        <div class="grid gap-6 md:grid-cols-3">
          <For each={experiences}>
            {(item, i) => (
              <Reveal delay={i() * 110}>
                <article class="group h-full overflow-hidden rounded-2xl border border-sand-300/70 bg-white shadow-[var(--shadow-card)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]">
                  <div class="relative h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      class="h-full w-full object-cover transition-transform duration-[1200ms]
                             ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                    />
                    <span
                      class="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px]
                             font-semibold uppercase tracking-[0.12em] text-navy-800 backdrop-blur-sm"
                    >
                      {item.distance}
                    </span>
                  </div>
                  <div class="p-6">
                    <h3 class="font-display text-2xl text-navy-900">{item.title}</h3>
                    <p class="mt-3 text-sm leading-relaxed text-navy-700/80">{item.description}</p>
                  </div>
                </article>
              </Reveal>
            )}
          </For>
        </div>
      </FeatureSection>

      {/* --- Amenities ---------------------------------------------------- */}
      <AmenitiesSection />

      {/* --- Getting here ------------------------------------------------- */}
      <section class="section bg-sand-50">
        <div class="shell">
          <div class="grid gap-12 lg:grid-cols-12">
            <div class="lg:col-span-4">
              <SectionHeading
                eyebrow="Getting here"
                title="Where to find us"
                description="Three hours from Manila by car, most of it on expressway. We can arrange a private transfer from NAIA on request."
              />

              <Reveal delay={120} class="mt-8 space-y-5 text-sm text-navy-700">
                <div class="flex gap-3">
                  <Icon name="pin" size={18} class="mt-0.5 shrink-0 text-gold-600" />
                  <span>
                    {site.address.line1}
                    <br />
                    {site.address.city}, {site.address.region} {site.address.postal}
                  </span>
                </div>
                <div class="flex gap-3">
                  <Icon name="car" size={18} class="mt-0.5 shrink-0 text-gold-600" />
                  <span>SCTEX to Dinalupihan, then the coastal road through Bagac.</span>
                </div>
                <div class="flex gap-3">
                  <Icon name="plane" size={18} class="mt-0.5 shrink-0 text-gold-600" />
                  <span>NAIA is the nearest airport, 2.5–3 hours by road.</span>
                </div>

                <A href="/contact" class="link-arrow !mt-8">
                  Full directions
                </A>
              </Reveal>
            </div>

            <Reveal delay={140} class="lg:col-span-8">
              <div class="overflow-hidden rounded-2xl border border-sand-300/70 shadow-[var(--shadow-card)]">
                <MapGoogle origin={travel.origin} destination={travel.destination} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
