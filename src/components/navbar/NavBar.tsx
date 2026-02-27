import { A } from "@solidjs/router";
import { createSignal, For, onMount, onCleanup } from "solid-js";
import Button from "../button/Button";
import { useNavigate } from "@solidjs/router";

const menuItems = [
  { href: "/pricing", label: "About Us" },
  { href: "/about", label: "Rooms" },
  { href: "/about", label: "Explore" },
  { href: "/support", label: "Contact Us" },
];

const leftItems = menuItems.slice(0, 2);
const rightItems = menuItems.slice(2);

export default function NavBar() {
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
          ${scrolled()
            ? "bg-white shadow-md"
            : "bg-transparent"}
        `}
      >
        <div class="max-w-6xl mx-auto px-4 flex items-center justify-center gap-20 relative">

          {/* Left side */}
          <div class="hidden md:flex items-center gap-20">
            <For each={leftItems}>
              {(item) => (
                <A
                  href={item.href}
                  class={`
                    transition-colors duration-200
                    ${scrolled()
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

          {/* Right side */}
          <div class="hidden md:flex items-center gap-20">
            <For each={rightItems}>
              {(item) => (
                <A
                  href={item.href}
                  class={`
                    transition-colors duration-200
                    ${scrolled()
                      ? "text-black hover:text-[var(--color-accent-1)]"
                      : "text-white hover:text-white/70"}
                  `}
                >
                  {item.label}
                </A>
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

            <Button onClick={[goTo, "/login"]}>
              Sign In
            </Button>
          </div>
        </div>
      )}
    </>
  );
}