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
  // Without a key the embedded map renders Google's grey "something went wrong"
  // panel, which reads as a broken site. Fall back to a styled link instead.
  const [unavailable, setUnavailable] = createSignal(!GOOGLE_MAPS_API_KEY);

  onMount(async () => {
    if (unavailable()) return;

    try {
      await loadGoogleMapsScript();
    } catch {
      setUnavailable(true);
      return;
    }

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

  const mapsLink = () =>
    `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      selectedPlace()?.query ?? AIRPORTS[0].query
    )}&destination=${encodeURIComponent(RESORT.name)}`;

  return (
    <div class={`flex flex-col overflow-hidden bg-white md:h-[600px] md:flex-row ${props.class ?? ""}`}>
      {/* Left panel */}
      <div class="flex w-full flex-col border-b border-sand-300/80 md:w-[268px] md:min-w-[268px] md:border-b-0 md:border-r">

        {/* Header — fixed, never scrolls */}
        <div class="flex flex-shrink-0 flex-col gap-1 border-b border-sand-300/60 bg-sand-50 p-5">
          <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-600/60">
            Get directions from
          </p>
          <div class="flex items-center gap-2">
            <MdFillLocation_on color="var(--color-gold-600)" />
            <p class="text-sm font-semibold text-navy-900">The Waterfront Beach Resort</p>
          </div>
        </div>

        <div class="flex flex-col md:min-h-0 md:flex-1">
          <For each={CATEGORIES}>
            {(category) => {
              const [open, setOpen] = createSignal(category.label === "Airports");
              return (
                <div class="flex min-h-0 flex-col border-b border-sand-300/60">
                  <button
                    onClick={() => setOpen(!open())}
                    class="flex w-full flex-shrink-0 cursor-pointer items-center justify-between border-none
                           bg-sand-100/70 px-5 py-3 text-left transition-colors hover:bg-sand-200/70"
                  >
                    <div class="flex items-center gap-2">
                      <category.icon size={15} color="var(--color-gold-600)" />
                      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-700">
                        {category.label}
                      </p>
                    </div>
                    <span class={`text-navy-400 transition-transform duration-200 ${open() ? "rotate-180" : ""}`}>
                      <MdOutlineKeyboard_arrow_down size={22} />
                    </span>
                  </button>

                  {/* Scroll is scoped to each category's places */}
                  <Show when={open()}>
                    <div class="always-scrollbar max-h-[600px] overflow-y-auto">
                      <For each={category.places}>
                        {(destination) => {
                          const isSelected = () => selectedPlace()?.name === destination.name;
                          return (
                            <button
                              onClick={() => showDirections(destination)}
                              class="w-full cursor-pointer border-b border-l-[3px] border-sand-200 px-5 py-3.5
                                     text-left transition-colors duration-150"
                              classList={{
                                "bg-gold-100/50 !border-l-gold-500": isSelected(),
                                "bg-white !border-l-transparent hover:bg-sand-50": !isSelected(),
                              }}
                            >
                              <p
                                class="mb-0.5 text-[13px] text-navy-900"
                                classList={{
                                  "font-semibold": isSelected(),
                                  "font-medium": !isSelected(),
                                }}
                              >
                                {destination.name}
                              </p>
                              <p class="text-[11px] text-navy-600/60">Click for directions →</p>
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
          <div class="flex-shrink-0 border-t border-red-200 bg-red-50 px-5 py-3">
            <p class="text-xs text-red-600">{error()}</p>
          </div>
        </Show>

        <Show when={loading()}>
          <div class="flex-shrink-0 border-t border-sand-300/60 bg-sand-50 px-5 py-3">
            <p class="text-xs text-navy-600/70">Loading directions…</p>
          </div>
        </Show>
      </div>

      {/* Map, or a graceful stand-in when the embed cannot run */}
      <Show
        when={!unavailable()}
        fallback={
          <div class="flex h-[300px] w-full flex-col items-center justify-center gap-4 bg-sand-100 px-8 text-center md:h-auto md:flex-1">
            <MdFillLocation_on size={26} color="var(--color-gold-600)" />
            <div>
              <p class="font-display text-2xl text-navy-900">{RESORT.name}</p>
              <p class="mt-2 max-w-xs text-sm text-navy-700/70">
                Sitio Pasinay, Barangay Nagbalayong, Morong, Bataan
              </p>
            </div>
            <a
              href={mapsLink()}
              target="_blank"
              rel="noreferrer noopener"
              class="btn-outline !px-6 !py-2.5"
            >
              Open in Google Maps
            </a>
          </div>
        }
      >
        <div ref={mapContainer} class="h-[300px] w-full md:h-auto md:flex-1" />
      </Show>
    </div>
  );
}
