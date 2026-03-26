import { Title } from "@solidjs/meta";
import { createResource, For } from "solid-js";
import BookingRoomCard from "~/components/cards/BookingRoomCard";
import { getProductsByCategoryName } from "~/lib/product";
import { formatPrice } from "~/utils/price";

export const gPlaceholderRoomImage = "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=";

export default function Rooms() {
  const [rooms] = createResource(() => getProductsByCategoryName("Room"));
  return (
    <main class="min-h-screen">
      <Title>Rooms</Title>

      <div class="max-w-7xl mx-auto px-6 py-16">
        {/* Page Header */}
        <div class="flex flex-col items-center mb-12 ">
          <h1 class="text-4xl md:text-5xl font-serif font-semibold">
            Our Rooms
          </h1>
          <p class="text-neutral-600 mt-3 text-lg">
            Discover comfort tailored to your stay.
          </p>
        </div>

        {/* Rooms List */}
        <div class="flex flex-col">
          <For each={rooms()}>
            {(room, index) => (
              <div class="py-6">
                <BookingRoomCard
                  image={gPlaceholderRoomImage}
                  title={room.name}
                  priceLabel={formatPrice(room.price)}
                />
              </div>
            )}
          </For>
        </div>
      </div>
    </main>
  );
}