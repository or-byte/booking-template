import { onMount, onCleanup, createSignal, For, Show } from "solid-js";

import { MdFillLocation_on, MdFillAirplanemode_active, MdFillBeach_access, MdOutlineKeyboard_arrow_down } from 'solid-icons/md';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const RESORT = {
  name: "The Waterfront Beach Resort, Bataan",
  lat: 14.6883,
  lng: 120.5377,
};

const AIRPORTS = [
  { name: "NAIA Terminal 1", query: "NAIA Terminal 1, Pasay, Metro Manila", lat: 14.5086, lng: 121.0197 },
  { name: "NAIA Terminal 3", query: "NAIA Terminal 3, Pasay, Metro Manila", lat: 14.5085, lng: 121.0191 },
  { name: "Clark International Airport", query: "Clark International Airport, Pampanga", lat: 15.1857, lng: 120.5600 },
];

const TOURIST_ATTRACTIONS = [
  { name: "Mt. Samat National Shrine", query: "Mt. Samat National Shrine, Pilar, Bataan", lat: 14.6957, lng: 120.5700 },
  { name: "Las Casas Filipinas de Acuzar", query: "Las Casas Filipinas de Acuzar, Bagac, Bataan", lat: 14.5956, lng: 120.3958 },
  { name: "Pawikan Conservation Center", query: "Pawikan Conservation Center, Morong, Bataan", lat: 14.6908, lng: 120.2697 },
  { name: "Ocean Adventure", query: "Ocean Adventure, Subic Bay Freeport Zone", lat: 14.7749, lng: 120.2673 },
  { name: "Zoobic Safari", query: "Zoobic Safari, Subic Bay Freeport Zone", lat: 14.7506, lng: 120.2668 },
  { name: "Subic Bay Freeport Zone", query: "Subic Bay Freeport Zone Gate, Maritan Hwy, Olongapo City", lat: 14.8032, lng: 120.3004 },
  { name: "Balanga Wetland and Nature Park", query: "Balanga Wetland and Nature Park, Tortugas, Balanga City, Bataan", lat: 14.6758, lng: 120.5359 },
];

const CATEGORIES = [
  { label: "Airports", icon: MdFillAirplanemode_active, places: AIRPORTS },
  { label: "Tourist Attractions", icon: MdFillBeach_access, places: TOURIST_ATTRACTIONS },
];

let googleMapScriptPromise: Promise<void> | null = null;

function loadGoogleMapsScript() {
  if (googleMapScriptPromise) return googleMapScriptPromise;
  googleMapScriptPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return; }
    const params = new URLSearchParams({
      key: GOOGLE_MAPS_API_KEY,
      v: "weekly",
      callback: "google.maps.__ib__",
    });
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?` + params;
    script.onerror = () => reject(new Error("Google Maps could not load."));
    window.google = window.google || {};
    window.google.maps = window.google.maps || {};
    window.google.maps.__ib__ = resolve;
    document.head.append(script);
  });
  return googleMapScriptPromise;
}

export default function MapGoogle(props: any) {
  let mapContainer: HTMLDivElement;
  let mapInstance: google.maps.Map;
  let directionsRenderer: google.maps.DirectionsRenderer;
  let directionsService: google.maps.DirectionsService;

  const [selectedPlace, setSelectedPlace] = createSignal<typeof AIRPORTS[0] | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    await loadGoogleMapsScript();

    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes") as google.maps.RoutesLibrary;

    mapInstance = new Map(mapContainer, {
      zoom: 10,
      center: { lat: RESORT.lat, lng: RESORT.lng },
      mapId: "DEMO_MAP_ID",
    });

    directionsService = new DirectionsService();
    directionsRenderer = new DirectionsRenderer({ suppressMarkers: false });
    directionsRenderer.setMap(mapInstance);

    await showDirections(AIRPORTS[0]);
  });

  async function showDirections(place: typeof AIRPORTS[0]) {
    if (!directionsService || !directionsRenderer) return;

    setSelectedPlace(place);
    setLoading(true);
    setError(null);

    try {
      const { TravelMode } = await google.maps.importLibrary("routes") as google.maps.RoutesLibrary;

      const response = await directionsService.route({
        origin: { query: place.query },
        destination: { query: RESORT.name },
        travelMode: TravelMode.DRIVING,
      });

      directionsRenderer.setDirections(response);
    } catch (e) {
      setError("Could not load directions. Please try again.");
      console.error("Directions request failed:", e);
    } finally {
      setLoading(false);
    }
  }

  onCleanup(() => {
    mapInstance = null;
  });

  return (
    <div class={`flex flex-col md:flex-row rounded-xl border border-slate-200 md:h-[600px] ${props.class ?? ""}`}>
      {/* Left panel */}
      <div class="w-full md:w-[260px] md:min-w-[260px] border-b md:border-b-0 md:border-r border-slate-200 flex flex-col ">

        {/* Header — fixed, never scrolls */}
        <div class="p-4 flex flex-col flex-shrink-0">
          <p class="text-[10px] uppercase tracking-widest text-slate-400 text-left ml-1">Get Directions From</p>
          <div class="flex gap-[5px]">
            <MdFillLocation_on color="var(--color-accent-1)" />
            <p class="text-sm font-semibold text-slate-800">The Waterfront Beach Resort</p>
          </div>
        </div>

        <div class="flex flex-col md:flex-1 md:min-h-0">
          <For each={CATEGORIES}>
            {(category) => {
              const [open, setOpen] = createSignal(category.label === "Airports");
              return (
                <div class="border-b border-slate-100 flex flex-col min-h-0">
                  <button
                    onClick={() => setOpen(!open())}
                    class="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border-none text-left flex-shrink-0"
                  >
                    <div class="flex items-center gap-2">
                      <category.icon size={15} color="var(--color-accent-1)" />
                      <p class="text-[12px] font-semibold text-slate-600 uppercase tracking-wider">{category.label}</p>
                    </div>
                    <span class={`text-slate-400 transition-transform duration-200 ${open() ? "rotate-180" : ""}`}>
                      <MdOutlineKeyboard_arrow_down size={23} />
                    </span>
                  </button>

                  {/* Scroll is scoped to each category's places */}
                  <Show when={open()}>
                    <div class="overflow-y-auto max-h-[600px] always-scrollbar">
                      <For each={category.places}>
                        {(destination) => {
                          const isSelected = () => selectedPlace()?.name === destination.name;
                          return (
                            <button
                              onClick={() => showDirections(destination)}
                              class="w-full px-4 py-3.5 text-left border-none border-b border-slate-100 cursor-pointer transition-colors duration-150 border-l-[3px]"
                              classList={{
                                "bg-[var(--color-accent-1)]/10 border-l-[var(--color-accent-1)]": isSelected(),
                                "bg-white border-l-transparent": !isSelected(),
                              }}
                            >
                              <p
                                class="mb-0.5 text-[13px]"
                                classList={{
                                  "font-semibold": isSelected(),
                                  "font-medium": !isSelected(),
                                }}
                              >
                                {destination.name}
                              </p>
                              <p class="text-[11px] text-slate-400">Click for directions →</p>
                            </button>
                          );
                        }}
                      </For>
                    </div>
                  </Show>
                </div>
              );
            }}
          </For>
        </div>

        <Show when={error()}>
          <div class="px-4 py-3 bg-red-50 border-t border-red-200 flex-shrink-0">
            <p class="text-xs text-red-600">{error()}</p>
          </div>
        </Show>

        <Show when={loading()}>
          <div class="px-4 py-3 bg-blue-50 border-t border-blue-200 flex-shrink-0">
            <p class="text-xs text-blue-500">Loading directions...</p>
          </div>
        </Show>
      </div>

      {/* Map */}
      <div ref={mapContainer} class="w-full h-[300px] md:h-auto md:flex-1 rounded-tr-xl rounded-br-xl" />
    </div>
  );
}