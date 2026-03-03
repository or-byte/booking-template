import { A } from "@solidjs/router";
import { createSignal, For, onMount, onCleanup } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";

const menuItems = [
  { href: "/about", label: "About Us" },
  { href: "/rooms", label: "Rooms" },
  { href: "/explore", label: "Explore" },
  { href: "/contact", label: "Contact Us" },
];

const exploreDropdown = [
  { href: "/attractions", label: "Attractions" },
  { href: "/activities", label: "Dining" },
  { href: "/facilities", label: "Facilities" },
  { href: "/offers", label: "Gallery" },
];

const leftItems = menuItems.slice(0, 2);
const rightItems = menuItems.slice(2);

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);

  const goTo = (path: string) => navigate(path);

  onMount(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    onCleanup(() => window.removeEventListener("scroll", handleScroll));
  });

  return (
    <>
      <nav
        class={`
          fixed top-0 left-0 w-full z-50
          transition-all duration-300
          ${scrolled() || location.pathname !== "/" ? "bg-white shadow-md" : "bg-transparent"}`}
      >
        <div class="
          max-w-6xl mx-auto px-4
          flex items-center
          justify-between md:justify-center
          gap-20 relative
        ">

          {/* Left side */}
          <div class="hidden md:flex items-center gap-20">
            <For each={leftItems}>
              {(item) => (
                <A
                  href={item.href}
                  class={`
                    transition-colors duration-200
                    ${scrolled() || location.pathname !== "/"
                      ? "text-black hover:text-[var(--color-accent-1)]"
                      : "text-white hover:text-white/70"}
                  `}
                >
                  {item.label}
                </A>
              )}
            </For>
          </div>

          {/* Center Logo */}
          <img
            src="/images/waterfront_logo.png"
            alt="logo"
            class={`
              cursor-pointer transition-all duration-300 w-[90px]`}
            onClick={[goTo, "/"]}
          />

          <div class="hidden md:flex items-center gap-20 relative">
            <For each={rightItems}>
              {(item) => (
                <div class="relative group">
                  <A
                    href={item.href}
                    class={`
                        transition-colors duration-200
                        ${scrolled() || location.pathname !== "/"
                        ? "text-black hover:text-[var(--color-accent-1)]"
                        : "text-white hover:text-white/70"}
                    `}
                  >
                    {item.label}
                  </A>

                  {/* Dropdown for Explore */}
                  {item.label === "Explore" && (
                    <div class="
                        absolute top-full left-0 mt-2 w-48 bg-white shadow-lg opacity-0
                        invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
                      ">
                      <For each={exploreDropdown}>
                        {(subItem) => (
                          <A
                            href={subItem.href}
                            class="block px-4 py-2 text-gray-700 hover:bg-[var(--color-accent-1)]/70 hover:text-white transition-colors"
                          >
                            {subItem.label}
                          </A>
                        )}
                      </For>
                    </div>
                  )}
                </div>
              )}
            </For>
          </div>

          {/* Mobile button */}
          <button
            class={`
              md:hidden text-2xl absolute right-4
              ${scrolled() ? "text-black" : "text-white"}
            `}
            onClick={() => setOpen(!open())}
          >
            {open() ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open() && (
        <div class="fixed inset-0 z-40 bg-white pt-[80px] transition-opacity duration-200">
          <div class="flex flex-col gap-6 px-6 py-8 text-black">
            <For each={menuItems}>
              {(item) => (
                <A
                  href={item.href}
                  class="text-2xl"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </A>
              )}
            </For>
          </div>
        </div>
      )}
    </>
  );
}