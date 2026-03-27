import { Title } from "@solidjs/meta";
import NavBar from "~/components/navbar/NavBar";
import Hero from "~/components/hero/HeroSection";
import FeatureSection from "~/components/feature_section/FeatureSection";
import RoomsCard from "~/components/cards/RoomsCard";
import AmenitiesSection from "~/components/amenities/AmenitiesSection";
import ImageGallery from "~/components/gallery/ImageGallery";
import { clientOnly } from "@solidjs/start";
import { formatPrice } from "~/utils/price";
import { createResource, Show } from "solid-js";
import { getProductsByCategoryName } from "~/lib/product";

const MapGoogle = clientOnly(() => import("~/components/map/MapGoogle"));

export default function Home() {
    const [rooms] = createResource(() => getProductsByCategoryName("Room"));
  
  return (
    <>
      <Title>The Waterfront Beach Resort</Title>
      <NavBar />
      <Hero />
      <FeatureSection
        title="Rooms & Suites"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        linkHref="rooms"
        linkLabel="View More Rooms"
      >

        {/* Room Cards */}
        <Show when={!rooms.loading}>
          <RoomsCard
            items={rooms()}
            defaultActive={0}
            expandedFlex={4}
            collapsedFlex={1.6} // slightly wider small cards
            renderContent={(room, isActive) => (
              <div class="absolute bottom-6 left-6 text-white">
                <p class="text-sm opacity-80">{formatPrice(room.price)}</p>
                <h2
                  class={`font-serif transition-all duration-500
                ${isActive ? "text-3xl" : "text-xl opacity-70"}
              `}
                >
                  {room.name}
                </h2>
              </div>
            )}
          />
        </Show>

      </FeatureSection>
      <FeatureSection
        title="Relax and Dine"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        linkHref="#"
        linkLabel="Go to El Mar"
      >
        <div class="flex justify-center w-full min-h-[200px] md:h-[400px]">
          <ImageGallery
            images={[
              "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
              "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
              "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
            ]}
          />
        </div>
      </FeatureSection>
      <FeatureSection
        title="Explore Bataan"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        linkHref="#"
        linkLabel="View More Details"
      >
        <div class="flex justify-center w-full min-h-[200px] md:h-[400px]">
          <ImageGallery
            images={[
              "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
              "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
              "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
            ]}
          />
        </div>
      </FeatureSection>
      <FeatureSection
        title="Where to Find Us"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">
        <MapGoogle
          origin="NAIA Terminal 1, Pasay, Metro Manila"
          destination="Waterfront Beach Resort, Bataan"
        />
      </FeatureSection>
      <AmenitiesSection />
    </>
  );
}
