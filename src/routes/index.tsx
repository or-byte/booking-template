import { Title } from "@solidjs/meta";
import NavBar from "~/components/navbar/NavBar";
import Hero from "~/components/hero/HeroSection";
import FeatureSection from "~/components/feature_section/FeatureSection";
import RoomsCard, { RoomsCardItem } from "~/components/cards/RoomsCard";
import AmenitiesSection from "~/components/amenities/AmenitiesSection";
import ImageGallery from "~/components/gallery/ImageGallery";
import { getAllRoomTypes } from "~/lib/room";
import { createMemo, createResource } from "solid-js";

const roomImagePlaceholder = "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=";

export default function Home() {
  const [rooms] = createResource(async () => await getAllRoomTypes());

  const roomsCardItems = createMemo<RoomsCardItem[]>(() => {
    const data = rooms();
    if (!data) return [];
    return data.map((p) => ({
      ...p,
      image: roomImagePlaceholder,
    }));
  });
  return (
    <>
      <Title>The Waterfront Beach Resort</Title>
      <NavBar />
      <Hero />
      <FeatureSection
        title="Rooms & Suites"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        linkHref="#"
        linkLabel="View More Rooms"
      >
        <RoomsCard
          items={roomsCardItems()}
          defaultActive={0}
          expandedFlex={4}
          collapsedFlex={1.6} // slightly wider small cards
          renderContent={(room, isActive) => (
            <div class="absolute bottom-6 left-6 text-white">
              <p class="text-sm opacity-80">{room.price}</p>
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
      </FeatureSection>
      <FeatureSection
        title="Relax and Dine"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        linkHref="#"
        linkLabel="Go to El Mar"
      >
        <div class="flex justify-center w-full h-[400px]">
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
        title="Pawikan Center Section"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        linkHref="#"
        linkLabel="View More Details"
      >
        <div class="flex justify-center w-full h-[400px]">
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
        title="Mount Samat"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        linkHref="#"
        linkLabel="View More Details"
      >
        <div class="flex justify-center w-full h-[400px]">
          <ImageGallery
            images={[
              "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
              "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
              "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
            ]}
          />
        </div>
      </FeatureSection>
      <AmenitiesSection />
    </>
  );
}
