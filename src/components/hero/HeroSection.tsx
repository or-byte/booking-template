import Button from "../button/Button";

export default function Hero() {
  return (
    <section
      class="h-screen w-full bg-cover bg-center relative flex items-center justify-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/60 before:via-black/40 before:to-black/20"
      style="background-image: url('/images/hero_img.jpg');"
    >
      {/* Dark overlay */}
      <div class="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div class="relative text-center text-white px-4">
        <h1 class="text-4xl md:text-6xl font-light tracking-wide mb-6">
          Experience Waterfront Luxury
        </h1>

        <p class="max-w-xl mx-auto text-lg md:text-xl mb-8 opacity-90 mb-25">
          Discover elegant rooms, breathtaking views, and unforgettable stays.
        </p>

        <Button class="px-20 py-5 border border-white hover:bg-white/15 transition-all duration-300 rounded-[10px]">
          Book Your Stay
        </Button>
      </div>
    </section>
  );
}