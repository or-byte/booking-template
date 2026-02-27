export default function AmenitiesSection() {
  const amenities = [
    "Free WiFi",
    "Pool",
    "Restaurant",
    "Parking",
    "Air Conditioning",
    "Beach Access",
    "Room Service",
    "Bar",
  ];

  return (
    <section class="py-20 bg-[#f5f5f5] text-center">
      <div class="max-w-4xl mx-auto px-6">

        <h2 class="text-3xl font-serif mb-10">Hotel Amenities</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-700">
          {amenities.map((item) => (
            <div class="flex items-center justify-center gap-2">
              <span>✦</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}