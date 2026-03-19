import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, Show } from "solid-js";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = createSignal("packages");
  const navigate = useNavigate();
  const goTo = (path: string) => navigate(path);

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "packages", label: "Packages" },
  ];

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  return (
    <div class="flex flex-col h-screen">
      {/* Top Navbar */}
      <div class="h-16 bg-blue-400 text-white flex items-center px-4 sm:px-6 shadow justify-between">
        <div class="flex items-center gap-4">
          <img
            src="/images/waterfront_logo.png"
            alt="logo"
            class="cursor-pointer w-[60px] sm:w-[90px] transition-all"
            onClick={[goTo, "/"]}
          />
          <h1 class="text-xl font-bold hidden sm:block">Admin Panel</h1>
        </div>

        {/* Mobile sidebar toggle */}
        <button
          class="sm:hidden p-2"
          onClick={[setSidebarOpen, !sidebarOpen()]}
        >
          {sidebarOpen() ? "✕" : "☰"}
        </button>
      </div>

      <div class="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          class={`bg-gray-50 p-4 flex flex-col gap-2 sm:w-48 sm:flex ${sidebarOpen() ? "block absolute z-20 w-48 h-full shadow-lg" : "hidden"
            }`}
        >
          {tabs.map((tab) => (
            <button
              class={[
                "p-3 rounded text-left flex items-center gap-2 transition-colors duration-200 w-full",
                activeTab() === tab.id
                  ? "bg-blue-300 text-blue-900 font-semibold"
                  : "hover:bg-gray-100 text-gray-700",
              ].join(" ")}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div class="flex-1 p-4 sm:p-6 overflow-auto">
          {/* Dashboard */}
          <Show when={activeTab() === "dashboard"}>
            <div>Admin Dashboard Content</div>
          </Show>

          {/* Products */}
          <Show when={activeTab() === "products"}>
            <div> Products Content </div>
          </Show>

          {/* Proposals */}
          <Show when={activeTab() === "packages"}>
            <div> Proposals Content </div>
          </Show>
        </div>
      </div>
    </div>
  );
}