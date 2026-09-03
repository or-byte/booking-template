import { A, useLocation, useNavigate } from "@solidjs/router";
import { createEffect, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import Icon from "~/components/ui/Icon";
import { photos, primaryNav, site } from "~/data/site";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = createSignal(false);
  const [exploreOpen, setExploreOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);

  /** The home page opens over the hero photograph; every other page starts on
   *  a light ground and needs the solid bar from the first pixel. */
  const overHero = () => location.pathname === "/" && !scrolled() && !open();

  const goTo = (path: string) => {
    setOpen(false);
    setExploreOpen(false);
    navigate(path);
  };

  onMount(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", handleScroll));

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setExploreOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    onCleanup(() => window.removeEventListener("keydown", handleKey));
  });

  // The drawer covers the viewport; freeze the page behind it.
  createEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open() ? "hidden" : "";
    onCleanup(() => {
      document.body.style.overflow = "";
    });
  });

  // Close the drawer whenever the route changes.
  createEffect(() => {
    location.pathname;
    setOpen(false);
    setExploreOpen(false);
  });

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const linkClass = (href: string) =>
    `relative py-1 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors duration-300
     after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left
     after:scale-x-0 after:transition-transform after:duration-300 after:ease-[var(--ease-out-soft)]
     hover:after:scale-x-100
     ${isActive(href) ? "after:scale-x-100" : ""}
     ${
       overHero()
         ? "text-white/90 hover:text-white after:bg-gold-300"
         : "text-navy-800 hover:text-navy-950 after:bg-gold-500"
     }`;

  return (
    <>
      <header
        class={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-soft)]
          ${
            overHero()
              ? "bg-gradient-to-b from-navy-950/55 to-transparent py-4"
              : "border-b border-sand-300/70 bg-sand-50/90 py-2 shadow-[var(--shadow-nav)] backdrop-blur-md"
          }`}
      >
        <nav class="shell flex items-center justify-between gap-6" aria-label="Primary">
          {/* Left links */}
          <div class="hidden flex-1 items-center gap-9 lg:flex">
            <For each={primaryNav.slice(0, 2)}>
              {(item) => (
                <A href={item.href} class={linkClass(item.href)}>
                  {item.label}
                </A>
              )}
            </For>
          </div>

          {/* Wordmark. The logo art is navy on transparent, so it needs to be
              lifted out of the dark hero with a soft glow rather than inverted. */}
          <A
            href="/"
            aria-label={`${site.name} — home`}
            class="shrink-0 transition-transform duration-500 ease-[var(--ease-out-soft)] hover:scale-[1.03]"
          >
            <img
              src={photos.logo}
              alt={site.name}
              width="96"
              height="96"
              class={`transition-all duration-500 ${
                overHero()
                  ? "w-[86px] brightness-0 invert md:w-[96px]"
                  : "w-[64px] md:w-[74px]"
              }`}
            />
          </A>

          {/* Right links + booking call to action */}
          <div class="hidden flex-1 items-center justify-end gap-9 lg:flex">
            <For each={primaryNav.slice(2)}>
              {(item) => (
                <div class="group relative">
                  <A href={item.href} class={`${linkClass(item.href)} inline-flex items-center gap-1`}>
                    {item.label}
                    <Show when={"children" in item}>
                      <Icon
                        name="chevronDown"
                        size={14}
                        class="transition-transform duration-300 group-hover:rotate-180"
                      />
                    </Show>
                  </A>

                  <Show when={"children" in item && item.children}>
                    {(children) => (
                      <div
                        class="invisible absolute left-1/2 top-full z-10 w-52 -translate-x-1/2 translate-y-2 pt-4
                               opacity-0 transition-all duration-300 ease-[var(--ease-out-soft)]
                               group-hover:visible group-hover:translate-y-0 group-hover:opacity-100
                               group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                      >
                        <div class="overflow-hidden rounded-xl border border-sand-300/80 bg-white/95 py-2 shadow-[var(--shadow-lift)] backdrop-blur-md">
                          <For each={children()}>
                            {(sub) => (
                              <A
                                href={sub.href}
                                class="block px-5 py-2.5 text-[13px] tracking-wide text-navy-700 transition-colors
                                       hover:bg-sand-100 hover:text-navy-950"
                              >
                                {sub.label}
                              </A>
                            )}
                          </For>
                        </div>
                      </div>
                    )}
                  </Show>
                </div>
              )}
            </For>

            <button
              type="button"
              onClick={[goTo, "/rooms"]}
              class={overHero() ? "btn-ghost-light !px-6 !py-2.5" : "btn-gold !px-6 !py-2.5"}
            >
              Book Now
            </button>
          </div>

          {/* Mobile controls */}
          <div class="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={[goTo, "/rooms"]}
              class={`${overHero() ? "btn-ghost-light" : "btn-gold"} !px-5 !py-2 !text-[11px]`}
            >
              Book
            </button>
            <button
              type="button"
              aria-label={open() ? "Close menu" : "Open menu"}
              aria-expanded={open()}
              onClick={() => setOpen(!open())}
              class={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300
                ${
                  overHero()
                    ? "border-white/40 text-white"
                    : "border-navy-900/15 text-navy-900"
                }`}
            >
              <span class="relative block h-3.5 w-5">
                <span
                  class={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-[var(--ease-out-soft)]
                    ${open() ? "top-1/2 rotate-45" : "top-0"}`}
                />
                <span
                  class={`absolute left-0 top-1/2 block h-px w-full bg-current transition-opacity duration-200
                    ${open() ? "opacity-0" : "opacity-100"}`}
                />
                <span
                  class={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-[var(--ease-out-soft)]
                    ${open() ? "top-1/2 -rotate-45" : "top-full"}`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        class={`fixed inset-0 z-40 bg-sand-50 transition-all duration-[400ms] ease-[var(--ease-out-soft)] lg:hidden
          ${open() ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div class="flex h-full flex-col overflow-y-auto px-6 pb-10 pt-28">
          <For each={primaryNav}>
            {(item, i) => (
              <div
                class="border-b border-sand-300/70 transition-all duration-500 ease-[var(--ease-out-soft)]"
                style={{
                  opacity: open() ? "1" : "0",
                  transform: open() ? "none" : "translateY(14px)",
                  "transition-delay": `${open() ? 90 + i() * 60 : 0}ms`,
                }}
              >
                <Show
                  when={"children" in item && item.children}
                  fallback={
                    <A
                      href={item.href}
                      class="block py-5 font-display text-3xl text-navy-900"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </A>
                  }
                >
                  {(children) => (
                    <div class="py-2">
                      <button
                        type="button"
                        class="flex w-full items-center justify-between py-3 font-display text-3xl text-navy-900"
                        onClick={() => setExploreOpen(!exploreOpen())}
                        aria-expanded={exploreOpen()}
                      >
                        {item.label}
                        <Icon
                          name="chevronDown"
                          size={22}
                          class={`transition-transform duration-300 ${exploreOpen() ? "rotate-180" : ""}`}
                        />
                      </button>

                      <div
                        class="grid overflow-hidden transition-[grid-template-rows] duration-[400ms] ease-[var(--ease-out-soft)]"
                        style={{ "grid-template-rows": exploreOpen() ? "1fr" : "0fr" }}
                      >
                        <div class="min-h-0">
                          <div class="ml-1 flex flex-col gap-1 border-l border-gold-400/60 pb-4 pl-5">
                            <For each={children()}>
                              {(sub) => (
                                <A
                                  href={sub.href}
                                  class="py-2 text-base tracking-wide text-navy-700"
                                  onClick={() => setOpen(false)}
                                >
                                  {sub.label}
                                </A>
                              )}
                            </For>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Show>
              </div>
            )}
          </For>

          <div class="mt-auto pt-10">
            <button type="button" class="btn-gold w-full" onClick={[goTo, "/rooms"]}>
              Check Availability
            </button>

            <div class="mt-8 space-y-2 text-sm text-navy-700">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} class="flex items-center gap-2.5">
                <Icon name="phone" size={16} class="text-gold-600" />
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} class="flex items-center gap-2.5">
                <Icon name="mail" size={16} class="text-gold-600" />
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
