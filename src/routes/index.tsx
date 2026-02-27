import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import NavBar from "~/components/navbar/NavBar";
import Hero from "~/components/hero/HeroSection";
import RoomsSection from "~/components/room/RoomSection";
import RestaurantSection from "~/components/restaurant/RestaurantSection";
import PawikanSection from "~/components/pawikan/PawikanSection";
import AttractionSection from "~/components/attraction/AttractionSection";
import AmenitiesSection from "~/components/amenities/AmenitiesSection";
import Footer from "~/components/footer/FooterSection";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <RoomsSection />
      <RestaurantSection />
      <PawikanSection />
      <AttractionSection />
      <AmenitiesSection />
      <Footer />
    </>
  );
}
