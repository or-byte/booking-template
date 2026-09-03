import { A } from "@solidjs/router";
import { For } from "solid-js";
import Icon from "~/components/ui/Icon";
import { fullAddress, photos, primaryNav, site } from "~/data/site";

const exploreLinks = [
  { href: "/explore#dining", label: "Dining" },
  { href: "/explore#facilities", label: "Facilities" },
  { href: "/explore#attractions", label: "Attractions" },
  { href: "/explore#gallery", label: "Gallery" },
];

export default function Footer() {
  return (
    <footer class="bg-navy-950 text-sand-200">
      {/* Closing call to action, carried on the footer rather than repeated as
          its own band on every page. */}
      <div class="shell border-b border-white/10 py-14 md:py-16">
        <div class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span class="eyebrow-light">Reservations</span>
            <p class="mt-4 max-w-lg font-display text-3xl leading-tight text-sand-50 md:text-4xl">
              Tell us your dates and we will hold a room.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <A href="/rooms" class="btn-gold">
              Check Availability
            </A>
            <A href="/contact" class="btn-ghost-light">
              Talk to Us
            </A>
          </div>
        </div>
      </div>

      <div class="shell grid gap-12 py-14 md:grid-cols-12 md:py-16">
        {/* Identity */}
        <div class="md:col-span-4">
          <img
            src={photos.logo}
            alt={site.name}
            width="120"
            height="120"
            class="w-[104px] brightness-0 invert"
          />
          <p class="mt-5 max-w-xs text-sm leading-relaxed text-sand-300/70">{site.tagline}.</p>

          <div class="mt-6 flex gap-3">
            <For each={site.socials}>
              {(social) => (
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  class="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-sand-200
                         transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400
                         hover:bg-gold-400 hover:text-navy-950"
                >
                  <Icon name={social.icon} size={17} />
                </a>
              )}
            </For>
          </div>
        </div>

        {/* Navigation */}
        <nav class="md:col-span-2" aria-label="Site">
          <h3 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">
            Visit
          </h3>
          <ul class="mt-5 space-y-3 text-sm">
            <For each={primaryNav}>
              {(item) => (
                <li>
                  <A
                    href={item.href}
                    class="text-sand-300/75 transition-colors duration-200 hover:text-sand-50"
                  >
                    {item.label}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </nav>

        <nav class="md:col-span-2" aria-label="Explore">
          <h3 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">
            Explore
          </h3>
          <ul class="mt-5 space-y-3 text-sm">
            <For each={exploreLinks}>
              {(item) => (
                <li>
                  <A
                    href={item.href}
                    class="text-sand-300/75 transition-colors duration-200 hover:text-sand-50"
                  >
                    {item.label}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </nav>

        {/* Contact */}
        <div class="md:col-span-4">
          <h3 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">
            Get in touch
          </h3>
          <ul class="mt-5 space-y-4 text-sm text-sand-300/75">
            <li class="flex gap-3">
              <Icon name="pin" size={17} class="mt-0.5 shrink-0 text-gold-400" />
              <span>
                {site.address.line1}
                <br />
                {site.address.city}, {site.address.region} {site.address.postal}
              </span>
            </li>
            <li>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                class="flex gap-3 transition-colors hover:text-sand-50"
              >
                <Icon name="phone" size={17} class="mt-0.5 shrink-0 text-gold-400" />
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                class="flex gap-3 transition-colors hover:text-sand-50"
              >
                <Icon name="mail" size={17} class="mt-0.5 shrink-0 text-gold-400" />
                {site.email}
              </a>
            </li>
            <li class="flex gap-3">
              <Icon name="clock" size={17} class="mt-0.5 shrink-0 text-gold-400" />
              <span>
                Check in {site.checkIn} · Check out {site.checkOut}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10">
        <div class="shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-sand-300/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p class="text-center sm:text-right">{fullAddress}</p>
        </div>
      </div>
    </footer>
  );
}
