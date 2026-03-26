import { A } from "@solidjs/router";
import { createSignal, For, onMount, onCleanup, Show } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import UserProfile from "../user/UserProfile";
import Input from "../input/Input";

const menuItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/packages", label: "Packages" },
];

export default function NavBarAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = createSignal(false);
  const [exploreOpen, setExploreOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);

  const goTo = (path: string) => {
    setOpen(false);
    navigate(path)
  };

  const toggle = () => {
    setOpen(!open());
  };

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
          px-4
          flex items-center
          justify-between
        ">
          <img
            src="/images/waterfront_logo.png"
            alt="logo"
            class={`
              cursor-pointer transition-all duration-300 w-[90px]`}
            onClick={[goTo, "/admin"]}
          />

          <div class="hidden md:flex items-center gap-20">
            <For each={menuItems}>
              {(item) => (
                <A
                  href={item.href}
                  class={`
                    transition-colors duration-200 body-2
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

          <div class="w-[50%]">
            <Input placeholder="Search packages...">
            </Input>
          </div>

          <UserProfile image="https://i.pinimg.com/736x/2b/ad/95/2bad9595e795660c86a71b5716469f35.jpg" />

          {/* Mobile button */}
          <button
            class={`
              md:hidden text-2xl absolute right-4
              ${scrolled() || open() || location.pathname !== "/" ? "text-black" : "text-white"}
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
                  class="text-xl"
                  onClick={toggle}
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