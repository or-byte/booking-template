import { Title } from "@solidjs/meta";
import NavBar from "~/components/navbar/NavBar";
import Hero from "~/components/hero/HeroSection";
import FeatureSection from "~/components/feature_section/FeatureSection";
import RoomsCard from "~/components/rooms_card/RoomsCard";
import AmenitiesSection from "~/components/amenities/AmenitiesSection";
import Footer from "~/components/footer/FooterSection";

const rooms = [
  {
    id: 1,
    title: "Superior Room",
    price: "$$$ per night",
    image: "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
  },
  {
    id: 2,
    title: "Deluxe",
    price: "$$$ per night",
    image: "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
  },
  {
    id: 3,
    title: "Standard",
    price: "$$$ per night",
    image: "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
  },
  {
    id: 4,
    title: "Dormitory",
    price: "$$$ per night",
    image: "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
  },
];


export default function Home() {
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
          items={rooms}
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
                {room.title}
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
        <img
          src="/images/restaurant.jpg"
          class="w-full h-[400px] object-cover"
        />
      </FeatureSection>
      <FeatureSection
        title="Pawikan Center Section"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        linkHref="#"
        linkLabel="View More Details"
      >
        <div class="grid md:grid-cols-2 gap-6">
          <img
            src="/images/turtles1.jpg"
            class="rounded-lg object-cover w-full h-[350px]"
          />

          <div class="grid gap-6">
            <img
              src="/images/turtles2.jpg"
              class="rounded-lg object-cover w-full h-[160px]"
            />
            <img
              src="/images/turtles3.jpg"
              class="rounded-lg object-cover w-full h-[160px]"
            />
          </div>
        </div>
      </FeatureSection>
      <FeatureSection
        title="Mount Samat"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        linkHref="#"
        linkLabel="View More Details"
      >
        <img
          src="/images/mount-samat.jpg"
          class="w-full h-[400px] object-cover rounded-lg"
        />
      </FeatureSection>
      <AmenitiesSection />
      <Footer />
    </>
  );
}
