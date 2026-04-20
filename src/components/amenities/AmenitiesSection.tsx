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

        <div class="grid gap-6 text-gray-700" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
          <For each={amenities}>
            {(amenity) => (
              <div class="flex items-center gap-2 min-w-0">
                <span class="mt-1 shrink-0 text-[var(--color-accent-1)]">✦</span>
                <span class="text-left truncate">{amenity}</span>
              </div>
            )}
          </For>
        </div>

      </div>
    </section>
  );
}