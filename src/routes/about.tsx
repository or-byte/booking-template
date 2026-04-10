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
            <strong>The Waterfront Beach Resort</strong> is an enchanting place set in the picturesque town of Morong, Bataan Peninsula where you will find everything you need to help you recharge and get in touch with nature, again and again. It is a fascinating gem of the province's western horizon luxuriates in a long stretch of natural, powdery fine beach sand where both children and adults alike will surely enjoy acquiring a healthy tan or simple unwinding from sunup to sundown.
          </p>

          <p class="text-neutral-700 leading-relaxed text-justify">
            During the summer, you can always count on our gorgeous sunsets that light up Bataan's sky providing a beautiful canvass with the best aerial photos without obstructions or disruptive sounds of the city. Between the months of August and February, female marine turtles, of Pawikan as we call them, go back to the shores of Morong, Bataan to lay their eggs. If your fortunate enough, you will be able to experience them hatch their eggs at the shoreline of the resort.
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
