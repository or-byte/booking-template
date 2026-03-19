import { Title } from "@solidjs/meta";
import Button from "~/components/button/Button";

export default function About() {
  return (
    <main>
      <Title>About</Title>

      <section class="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-2 items-center mt-20">
        <div class="flex flex-col space-y-4 items-center text-center md:text-left">
          <h2 class="text-2xl font-serif text-neutral-900">
            About Us
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
