import Button from "../button/Button";
import { useNavigate } from "@solidjs/router";

export default function Hero() {
  const navigate = useNavigate();
  const goToRooms = () => navigate("/booking");

  return (
    <section
      class="
        relative w-full overflow-hidden
        min-h-[100vh] md:min-h-screen
        bg-cover bg-center
        flex items-center justify-center
      "
      style="background-image: url('/images/hero_img.jpg');"
    >
      {/* Gradient Overlay */}
      <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />

      {/* Content */}
      <div class="
        relative
        text-center text-white
        px-6
        max-w-4xl
      ">
        <h1 class="
          text-4xl
          sm:text-4xl
          md:text-5xl
          lg:text-7xl
          font-light
          tracking-wide
          leading-[1.2]
          pb-5
          pt-5
        ">
          Soak up the sunshine on our Waterfront Oasis
        </h1>

        <p class="
          mx-auto
          text-base
          sm:text-lg
          md:text-xl
          opacity-90
          mb-8 md:mb-10
          max-w-2xl
        ">
          Treat yourself to a luxurious vacation you've been longing for and experience an exclusive, serene getaway at
          The Waterfront Beach Resort.
        </p>

        <Button
          class="
            px-8 py-3
            sm:px-10 sm:py-4
            md:px-14 md:py-5
            border border-white
            hover:bg-white/15
            transition-all duration-300
            rounded-[10px]
            cursor-pointer
          "
          onClick={goToRooms}
        >
          Book Your Stay
        </Button>
      </div>
    </section>
  );
}