import { A } from "@solidjs/router";
import { createSignal, For, onMount, onCleanup, createResource } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import UserProfile from "../user/UserProfile";
import SearchInput from "../search/SearchInput";
import { Package, getAllPackages } from "~/lib/package";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/packages", label: "Packages" },
];

export default function NavBarAdmin() {
  const [search, setSearch] = createSignal("");
  const [packages] = createResource(search, async (s) => await getAllPackages(1, 5, s));
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);

  const navigateToPackages = (item: Package) => {
    console.log("nav");

    navigate(`/admin/packages?id=${item.id}`)
  }

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
            <SearchInput
              placeholder="Search..."
              value={search()}
              onInput={(e) => setSearch(e.currentTarget.value)}
              open={packages()?.data.length ?? 0}
            >
              <For each={packages()?.data}>
                {(item) => (
                  <div
                    class="p-2 hover:bg-gray-100 cursor-pointer w-full"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => navigateToPackages(item)} >
                    {item.description}
                  </div>
                )}
              </For>
            </SearchInput>
          </div>

          {/* UserProfile — clicking opens mobile menu on mobile only */}
          <div
            class="md:hidden cursor-pointer"
            onClick={() => setOpen(!open())}
          >
            <UserProfile image="https://i.pinimg.com/736x/2b/ad/95/2bad9595e795660c86a71b5716469f35.jpg" />
          </div>

          {/* UserProfile on desktop — no toggle */}
          <div class="hidden md:block">
            <UserProfile image="https://i.pinimg.com/736x/2b/ad/95/2bad9595e795660c86a71b5716469f35.jpg" />
          </div>
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