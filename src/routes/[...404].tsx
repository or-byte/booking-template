import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";
import { photos, site } from "~/data/site";

export default function NotFound() {
  return (
    <main class="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <Title>Page not found — {site.name}</Title>
      <HttpStatusCode code={404} />

      <img
        src={photos.hero}
        alt=""
        class="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div class="absolute inset-0 -z-10 bg-navy-950/80" />

      <div class="shell py-32 text-center">
        <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-300">
          Error 404
        </p>

        <h1 class="mx-auto mt-6 max-w-2xl font-display text-sand-50">
          This page has drifted out to sea
        </h1>

        <p class="mx-auto mt-5 max-w-md leading-relaxed text-sand-100/75">
          The link you followed does not lead anywhere on our site. The rooms,
          though, are exactly where you left them.
        </p>

        <div class="mt-10 flex flex-wrap justify-center gap-3">
          <A href="/" class="btn-gold">
            Back to home
          </A>
          <A href="/rooms" class="btn-ghost-light">
            View rooms
          </A>
        </div>
      </div>
    </main>
  );
}
