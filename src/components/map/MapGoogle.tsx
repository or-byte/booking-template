import { onMount, onCleanup, createSignal, For, Show } from "solid-js";
import { MdFillLocation_on } from 'solid-icons/md';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const RESORT = {
  name: "The Waterfront Beach Resort, Bataan",
  lat: 14.6883,
  lng: 120.5377,
};

const destinations = [
  { name: "NAIA Terminal 1", query: "NAIA Terminal 1, Pasay, Metro Manila", lat: 14.5086, lng: 121.0197 },
  { name: "NAIA Terminal 3", query: "NAIA Terminal 3, Pasay, Metro Manila", lat: 14.5085, lng: 121.0191 },
  { name: "Clark International Airport", query: "Clark International Airport, Pampanga", lat: 15.1857, lng: 120.5600 },
  { name: "Mt. Samat National Shrine", query: "Mt. Samat National Shrine, Pilar, Bataan", lat: 14.6957, lng: 120.5700 },
  { name: "Las Casas Filipinas de Acuzar", query: "Las Casas Filipinas de Acuzar, Bagac, Bataan", lat: 14.5956, lng: 120.3958 },
];

let scriptPromise = null;

function loadGoogleMapsScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
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
  return scriptPromise;
}

export default function MapGoogle(props: any) {
  let mapContainer: HTMLDivElement;
  let mapInstance: google.maps.Map;
  let directionsRenderer: google.maps.DirectionsRenderer;
  let directionsService: google.maps.DirectionsService;

  const [selectedPlace, setSelectedPlace] = createSignal<typeof destinations[0] | null>(null);
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

    await showDirections(destinations[0]);
  });

  async function showDirections(place: typeof destinations[0]) {
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
    <div class={`flex flex-col md:flex-row overflow-hidden rounded-xl border border-slate-200 ${props.class ?? ""}`}>
      {/* Left panel */}
      <div class="w-full md:w-[260px] md:min-w-[260px] bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col md:overflow-hidden">
        <div class="p-4 flex flex-col">
          <p class="text-[11px] uppercase tracking-widest text-slate-400 text-left ml-1">Get Directions From</p>
          <div class="flex gap-[5px]">
            <MdFillLocation_on color="var(--color-accent-1)" />
            <p class="text-sm font-semibold text-slate-800">The Waterfront Beach Resort</p>
          </div>
        </div>

        <div class="flex flex-col md:flex-col overflow-x-auto md:overflow-x-hidden overflow-y-hidden md:overflow-y-auto flex-1">
          <For each={destinations}>
            {(destination) => {
              const isSelected = () => selectedPlace()?.name === destination.name;
              return (
                <button
                  onClick={() => showDirections(destination)}
                  class="flex-shrink-0 md:flex-shrink px-4 py-3 md:py-3.5 text-left border-none border-r md:border-r-0 md:border-b border-slate-100 cursor-pointer transition-colors duration-150 min-w-[140px] md:min-w-0 md:w-full"
                  classList={{
                    "bg-[var(--color-accent-1)]/10 border-b-[3px] md:border-b-0 md:border-l-[3px] border-[var(--color-accent-1)]": isSelected(),
                    "bg-white border-b-transparent md:border-l-[3px] md:border-l-transparent": !isSelected(),
                  }}
                >
                  <p
                    class="mb-0.5 text-[13px] whitespace-nowrap md:whitespace-normal"
                    classList={{
                      "font-semibold": isSelected(),
                      "font-medium": !isSelected(),
                    }}
                  >
                    {destination.name}
                  </p>
                  <p class="text-[11px] text-slate-400 hidden md:block">Click for directions →</p>
                </button>
              );
            }}
          </For>
        </div>

        <Show when={error()}>
          <div class="px-4 py-3 bg-red-50 border-t border-red-200">
            <p class="text-xs text-red-600">{error()}</p>
          </div>
        </Show>

        <Show when={loading()}>
          <div class="px-4 py-3 bg-blue-50 border-t border-blue-200">
            <p class="text-xs text-blue-500">Loading directions...</p>
          </div>
        </Show>
      </div>

      {/* Map */}
      <div ref={mapContainer} class="w-full h-[300px] md:h-auto md:flex-1" />
    </div>
  );
}