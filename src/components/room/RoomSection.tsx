export default function RoomsSection() {
  return (
    <section class="py-20 bg-[#f5f5f5]">
      <div class="max-w-6xl mx-auto px-6">

        <h2 class="text-3xl font-serif mb-4">Rooms & Suites</h2>
        <p class="text-gray-600 max-w-2xl mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        <a href="#" class="text-sm text-blue-600 hover:underline mb-8 inline-block">
          View More Rooms →
        </a>

        <div class="grid md:grid-cols-4 gap-6">
          
          {/* Large Card */}
          <div class="md:col-span-2 relative rounded-lg overflow-hidden">
            <img src="/images/room1.jpg" class="w-full h-full object-cover" />
            <div class="absolute bottom-0 left-0 p-6 text-white bg-gradient-to-t from-black/70 to-transparent w-full">
              <p class="text-sm">$55 per night</p>
              <h3 class="text-xl font-semibold">Superior Room</h3>
            </div>
          </div>

          {/* Small Cards */}
          {["Deluxe", "Standard", "Dormitory"].map((room) => (
            <div class="relative rounded-lg overflow-hidden">
              <img src="/images/room2.jpg" class="w-full h-full object-cover" />
              <div class="absolute bottom-0 left-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent w-full">
                <p class="text-sm">$55 per night</p>
                <h3 class="text-lg">{room}</h3>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}