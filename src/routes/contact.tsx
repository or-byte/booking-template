import { Title } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";
import { MdFillAirplanemode_active } from 'solid-icons/md'

const MapGoogle = clientOnly(() => import("~/components/map/MapGoogle"));

export default function About() {
  return (
    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Title>Contact Us</Title>

      <MapGoogle
        origin="NAIA Terminal 1, Pasay, Metro Manila"
        destination="Waterfront Beach Resort, Bataan"
        height="600px"
      />

      <div class="mt-10">
        <p class="font-semibold text-lg mb-5">How to get here</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <MdFillAirplanemode_active />
              <p class="font-semibold">From NAIA (Manila International Airport)</p>
            </div>
            <p class="text-[#8E8E8E] text-sm">1. Exit airport and take a taxi or Grab to Olongapo.</p>
            <p class="text-[#8E8E8E] text-sm">2. Travel time: 1.5 – 2 hours.</p>
            <p class="text-[#8E8E8E] text-sm">3. Tell the driver: The Waterfront Beach Resort, Morong Bataan.</p>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <MdFillAirplanemode_active />
              <p class="font-semibold">From NAIA (Manila International Airport)</p>
            </div>
            <p class="text-[#8E8E8E] text-sm">1. Exit airport and take a taxi or Grab to Olongapo.</p>
            <p class="text-[#8E8E8E] text-sm">2. Travel time: 1.5 – 2 hours.</p>
            <p class="text-[#8E8E8E] text-sm">3. Tell the driver: The Waterfront Beach Resort, Morong Bataan.</p>
          </div>
        </div>
      </div>
    </main>
  );
}