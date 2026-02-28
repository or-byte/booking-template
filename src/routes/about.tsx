import { Title } from "@solidjs/meta";

export default function About() {
  return (
    <main>
      <Title>About</Title>

      {/* HERO IMAGE */}
      <section class="w-full h-[320px] md:h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          class="w-full h-full object-cover"
          alt=""
        />
      </section>

      {/* INTRO */}
      <section class="max-w-4xl mx-auto px-6 py-16 space-y-6">
        <h1 class="md:text-4xl text-neutral-900">
          About Us
        </h1>

        <p class="text-neutral-700 leading-relaxed text-justify">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>

        <p class="text-neutral-700 leading-relaxed text-justify">
          Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
          cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </p>
      </section>

      {/* IMAGE + STORY */}
      <section class="max-w-6xl mx-auto px-6 py-12 grid gap-12 md:grid-cols-2 items-center">
        <div class="space-y-4">
          <h2 class="text-2xl font-serif text-neutral-900">
            Our Story
          </h2>

          <p class="text-neutral-700 leading-relaxed text-justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            eget nisl nec urna fermentum tincidunt. Integer sit amet
            malesuada erat. Vestibulum ante ipsum primis in faucibus orci
            luctus et ultrices posuere cubilia curae.
          </p>

          <p class="text-neutral-700 leading-relaxed text-justify">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba"
          class="w-full h-[300px] object-cover rounded-sm"
          alt=""
        />
      </section>
    </main>
  );
}
