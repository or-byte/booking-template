import { Meta, Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For } from "solid-js";
import PageHero from "~/components/ui/PageHero";
import Reveal from "~/components/ui/Reveal";
import SectionHeading from "~/components/ui/SectionHeading";
import Icon from "~/components/ui/Icon";
import { glance, photos, site } from "~/data/site";

const values = [
  {
    icon: "beach" as const,
    title: "The shoreline first",
    body: "Nothing is built between the rooms and the water. The tallest thing on the property is a palm.",
  },
  {
    icon: "users" as const,
    title: "Run by the family",
    body: "The same household has managed the resort since 1998, and most of the team is from Nagbalayong.",
  },
  {
    icon: "spa" as const,
    title: "Quiet by design",
    body: "Twenty-four rooms, no function hall on the beach, and last call at midnight.",
  },
];

export default function About() {
  return (
    <main>
      <Title>About Us — {site.name}</Title>
      <Meta
        name="description"
        content="A family-run beachfront resort in Morong, Bataan, welcoming guests since 1998."
      />

      <PageHero
        eyebrow="Our story"
        title="Twenty-eight years on the same stretch of sand"
        description="The Waterfront began as a weekend house. The rooms came later, one at a time."
        image={photos.dusk}
      />

      {/* --- Story -------------------------------------------------------- */}
      <section class="section bg-sand-50">
        <div class="shell grid gap-14 lg:grid-cols-12 lg:items-center">
          <Reveal class="order-2 lg:order-1 lg:col-span-6">
            <div class="relative">
              <img
                src={photos.shore}
                alt="Guests on the beach at sunset"
                loading="lazy"
                class="aspect-[4/5] w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
              />
              <div
                class="absolute -right-4 bottom-8 hidden rounded-2xl bg-navy-950 px-7 py-6 text-sand-50
                       shadow-[var(--shadow-lift)] md:block"
              >
                <p class="font-display text-4xl leading-none text-gold-300">1998</p>
                <p class="mt-2 text-[11px] uppercase tracking-[0.16em] text-sand-300/70">
                  First guests
                </p>
              </div>
            </div>
          </Reveal>

          <div class="order-1 lg:order-2 lg:col-span-6">
            <SectionHeading
              eyebrow="About us"
              title="A resort that grew out of a family weekend house"
              description="What is now twenty-four rooms started as one house on a lot in Sitio Pasinay, bought because the sunset was better there than anywhere else on the bay."
            />

            <Reveal delay={120} class="mt-6 space-y-5 leading-relaxed text-navy-700/80">
              <p>
                The first four rooms were built for friends who kept asking to
                stay. The restaurant followed because there was nowhere nearby to
                eat, and the pool because the sea gets rough in the habagat
                months. Everything since has been added the same way — because a
                guest needed it, not because a plan called for it.
              </p>
              <p>
                Most of the team lives within a few kilometres of the property.
                Several of them have been here longer than the pool has. If you
                have stayed before, someone at the front desk will remember which
                room you asked for.
              </p>
            </Reveal>

            <Reveal delay={180} class="mt-9 flex flex-wrap gap-3">
              <A href="/rooms" class="btn-primary">
                See the rooms
              </A>
              <A href="/contact" class="btn-outline">
                Get in touch
              </A>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- What we hold to ---------------------------------------------- */}
      <section class="section bg-white">
        <div class="shell">
          <SectionHeading
            eyebrow="How we run it"
            title="Three things we have not changed"
            align="center"
          />

          <div class="mt-14 grid gap-6 md:grid-cols-3">
            <For each={values}>
              {(value, i) => (
                <Reveal delay={i() * 100}>
                  <article class="h-full rounded-2xl border border-sand-300/70 bg-sand-50 p-8">
                    <span class="grid h-11 w-11 place-items-center rounded-full bg-navy-950 text-gold-300">
                      <Icon name={value.icon} size={19} />
                    </span>
                    <h3 class="mt-6 font-display text-2xl text-navy-900">{value.title}</h3>
                    <p class="mt-3 text-sm leading-relaxed text-navy-700/80">{value.body}</p>
                  </article>
                </Reveal>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* --- Numbers ------------------------------------------------------- */}
      <section class="section-tight bg-navy-950 text-sand-100">
        <div class="shell">
          <dl class="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
            <For each={glance}>
              {(stat, i) => (
                <Reveal delay={i() * 80} class="text-center">
                  <dt class="font-display text-4xl text-gold-300 md:text-5xl">{stat.value}</dt>
                  <dd class="mt-2 text-xs uppercase tracking-[0.16em] text-sand-300/60">
                    {stat.label}
                  </dd>
                </Reveal>
              )}
            </For>
          </dl>
        </div>
      </section>
    </main>
  );
}
