import { For } from "solid-js";

export default function AmenitiesSection() {
  const amenities = [
    "Swimming Pool",
    "Watersports (Jetski, Banana Boat, Billiards",
    "Basketball Court",
    "Beach Volleyball",
    "Conference Room",
    "Souvenir Shop"
  ];

  return (
    <section class="py-20 bg-[#f5f5f5] text-center">
      <div class="max-w-4xl mx-auto px-6">

        <h2 class="text-3xl font-serif mb-10">Hotel Amenities</h2>

        <div class="flex flex-col md:grid gap-x-10 gap-y-4 text-gray-700" style="grid-template-columns: repeat(3, auto)"> 
          <For each={amenities}>
            {(amenity) => (
              <div class="flex items-center gap-2">
                <span class="shrink-0 text-[var(--color-accent-1)]">✦</span>
                <span class="text-left">{amenity}</span>
              </div>
            )}
          </For>
        </div>

      </div>
    </section>
  );
}