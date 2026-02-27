export default function RestaurantSection() {
  return (
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-6">

        <h2 class="text-3xl font-serif mb-4">Relax and Dine</h2>
        <p class="text-gray-600 max-w-2xl mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        <a href="#" class="text-sm text-blue-600 hover:underline mb-8 inline-block">
          Go to El Mar →
        </a>

        <div class="rounded-lg overflow-hidden">
          <img src="/images/restaurant.jpg" class="w-full h-[400px] object-cover" />
        </div>

      </div>
    </section>
  );
}