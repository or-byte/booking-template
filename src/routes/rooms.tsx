import { Meta, Title } from "@solidjs/meta";
import { createAsync, useSearchParams } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import BookingRoomCard from "~/components/cards/BookingRoomCard";
import BookingBar from "~/components/booking/BookingBar";
import PageHero from "~/components/ui/PageHero";
import Reveal from "~/components/ui/Reveal";
import Icon from "~/components/ui/Icon";
import { getRooms } from "~/lib/rooms";
import { formatPrice } from "~/utils/price";
import { photos, site } from "~/data/site";

/** Kept for callers that still import the old placeholder constant. */
export const gPlaceholderRoomImage = photos.rooms[0];

const readableDate = (value: string) =>
  new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function Rooms() {
  const rooms = createAsync(() => getRooms());
  const [params] = useSearchParams();

  // The hero booking bar hands its dates over as query parameters; echo them
  // back so a guest arriving from the home page knows the search carried.
  const hasSearch = () => Boolean(params.checkIn && params.checkOut);

  return (
    <main>
      <Title>Rooms & Suites — {site.name}</Title>
      <Meta
        name="description"
        content="Sea view rooms, garden casitas, family lofts and a beachfront suite in Morong, Bataan. Rates include daily breakfast."
      />

      <PageHero
        eyebrow="Accommodation"
        title="Rooms & Suites"
        description="Twenty-four rooms across four types. Every rate includes breakfast, Wi-Fi and the sunset."
        image={photos.resort}
      />

      <section class="bg-sand-50 py-14 md:py-20">
        <div class="shell">
          <Show when={hasSearch()}>
            <Reveal class="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-gold-300/60 bg-gold-100/50 px-5 py-4 text-sm text-navy-800">
              <Icon name="clock" size={16} class="text-gold-600" />
              <span>
                Showing rooms for{" "}
                <strong class="font-semibold">{readableDate(params.checkIn as string)}</strong> –{" "}
                <strong class="font-semibold">{readableDate(params.checkOut as string)}</strong>
                <Show when={params.guests}>
                  {" "}
                  · {params.guests} {params.guests === "1" ? "guest" : "guests"}
                </Show>
              </span>
              <span class="text-navy-600/70">
                Confirm the reservation with the front desk to hold these dates.
              </span>
            </Reveal>
          </Show>

          <BookingBar class="mb-14" />

          <Suspense
            fallback={
              <div class="flex h-[400px] items-center justify-center">
                <span class="spinner" />
              </div>
            }
          >
            <div class="flex flex-col gap-8 md:gap-10">
              <For each={rooms()}>
                {(room, i) => (
                  <Reveal delay={i() * 60}>
                    <BookingRoomCard
                      image={room.image}
                      title={room.name}
                      priceLabel={formatPrice(room.price)}
                      description={room.description}
                      capacity={room.capacity}
                      size={room.size}
                      bed={room.bed}
                      view={room.view}
                      features={room.features}
                      reversed={i() % 2 === 1}
                      href="/contact"
                    />
                  </Reveal>
                )}
              </For>
            </div>
          </Suspense>

          {/* Practical notes that would otherwise be asked by email. */}
          <Reveal class="mt-16 grid gap-6 rounded-2xl border border-sand-300/70 bg-white p-8 sm:grid-cols-3">
            <div>
              <p class="eyebrow">Check in</p>
              <p class="mt-2 font-display text-2xl text-navy-900">{site.checkIn}</p>
            </div>
            <div>
              <p class="eyebrow">Check out</p>
              <p class="mt-2 font-display text-2xl text-navy-900">{site.checkOut}</p>
            </div>
            <div>
              <p class="eyebrow">Cancellation</p>
              <p class="mt-2 text-sm leading-relaxed text-navy-700/80">
                Free up to 7 days before arrival. Within 7 days, the first night
                is charged.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
