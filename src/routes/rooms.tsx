import { Title } from "@solidjs/meta";
import { createResource, For, Show } from "solid-js";
import BookingRoomCard from "~/components/cards/BookingRoomCard";
import { getAllRoomTypes } from "~/lib/room";

export default function Rooms() {
  const [rooms] = createResource(async () => { return await getAllRoomTypes() });

  return (
    <main class="min-h-screen">
      <Title>Rooms</Title>

      <div class="max-w-7xl mx-auto px-6 py-16">
        {/* Page Header */}
        <div class="mb-12">
          <h1 class="text-4xl md:text-5xl font-serif font-semibold">
            Our Rooms
          </h1>
          <p class="text-neutral-600 mt-3 text-lg">
            Discover comfort tailored to your stay.
          </p>
        </div>

        {/* Rooms List */}
        <div class="flex flex-col gap-4">
          <Show
            when={!rooms.loading}
            fallback={
              <For each={Array(3)}>
                {() =>
                  <div class="py-6">
                    <div
                      class="w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px] rounded-2xl overflow-hidden bg-gray-200 animate-pulse shadow-md transition-all duration-300"
                    />
                  </div>
                }
              </For>
            }
          >
            <For each={rooms()}>
              {(room) => (
                <div class="py-6">
                  <BookingRoomCard
                    image="https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU="
                    title={room.name}
                    priceLabel={room.price.toString()}
                  />
                </div>
              )}
            </For>
          </Show>
        </div>
      </div>
    </main >
  );
}