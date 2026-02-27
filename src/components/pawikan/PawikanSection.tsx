export default function PawikanSection() {
  return (
    <section class="py-20 bg-[#f5f5f5]">
      <div class="max-w-6xl mx-auto px-6">

        <h2 class="text-3xl font-serif mb-4">Pawikan Center Section</h2>
        <p class="text-gray-600 max-w-2xl mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        <a href="#" class="text-sm text-blue-600 hover:underline mb-8 inline-block">
          View More Details →
        </a>

        <div class="grid md:grid-cols-2 gap-6">
          <img src="/images/turtles1.jpg" class="rounded-lg object-cover w-full h-[350px]" />
          <div class="grid gap-6">
            <img src="/images/turtles2.jpg" class="rounded-lg object-cover w-full h-[160px]" />
            <img src="/images/turtles3.jpg" class="rounded-lg object-cover w-full h-[160px]" />
          </div>
        </div>

      </div>
    </section>
  );
}