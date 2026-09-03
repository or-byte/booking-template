import { For } from "solid-js";
import Icon from "~/components/ui/Icon";
import Reveal from "~/components/ui/Reveal";
import SectionHeading from "~/components/ui/SectionHeading";
import { amenities } from "~/data/site";

export default function AmenitiesSection(props: { id?: string }) {
  return (
    <section id={props.id} class="section bg-navy-950 text-sand-100">
      <div class="shell">
        <SectionHeading
          eyebrow="Everything included"
          title="What comes with the stay"
          description="The practical list. Nothing here carries a surcharge, and nothing needs to be arranged in advance."
          align="center"
          tone="light"
        />

        <div class="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          <For each={amenities}>
            {(amenity, i) => (
              <Reveal
                delay={i() * 45}
                class="group flex flex-col gap-3 bg-navy-950 p-6 transition-colors duration-500 hover:bg-navy-900"
              >
                <span
                  class="grid h-10 w-10 place-items-center rounded-full border border-gold-400/35
                         text-gold-300 transition-colors duration-500 group-hover:border-gold-300
                         group-hover:bg-gold-400 group-hover:text-navy-950"
                >
                  <Icon name={amenity.icon} size={18} />
                </span>
                <span class="text-[15px] font-medium text-sand-50">{amenity.label}</span>
                <span class="text-[13px] leading-relaxed text-sand-300/60">{amenity.note}</span>
              </Reveal>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
