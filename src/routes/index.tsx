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
import { getProductsByCategoryName, ProductPreview } from "~/lib/product";

const MapGoogle = clientOnly(() => import("~/components/map/MapGoogle"));

export default function Home() {
  const [rooms] = createResource(async () => { return await getProductsByCategoryName("Room", true) as ProductPreview[] });

  return (
    <>
      <Title>The Waterfront Beach Resort</Title>
      <NavBar />
      <Hero />
      <FeatureSection
        title="Rooms & Suites"
        description="You will find comfort & will feel relaxed at our 2 story and bungalow buildings with spacious rooms, balconies and views of the marginal sea of the Western Pacific Ocean."
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
        description="Kick off your morning with breakfast and a cup of coffee, while enjoying the beautiful sunrise in the shoreline of Morong and indulge later your favorite drink from the restaurant and bar before catching the sunset at dinner."
        linkHref="#"
        linkLabel="Go to El Mar"
      >
        <div class="flex justify-center w-full min-h-[200px] md:h-[400px]">
          <ImageGallery
            images={[
              "/images/elmar/el_mar_1.jpg",
              "/images/elmar/el_mar_2.jpg", 
              "/images/elmar/el_mar_3.jpg",
            ]}
          />
        </div>
      </FeatureSection>
      <FeatureSection
        title="Explore Bataan"
        description={" With limitless things to do & adventures to encounter, there are plenty of beach activities for every interest, age and curiosity.  Families will enjoy the turquoise waters ofwhile sport lovers will enjoy the opportunity to snorkel, fish and the many different boat rides, whether they be for fun rides or for tour rides nearby the resort.  Our swimming pool is open year round for you to always enjoy a day with the whole family!"}
        linkHref="#"
        linkLabel="View More Details"
      >
        <div class="flex justify-center w-full min-h-[200px] md:h-[400px]">
          <ImageGallery
            images={[
              "/images/samat.jpeg",
              "/images/lascasas.jpeg",
              "/images/pawikan.jpg",
            ]}
          />
        </div>
      </FeatureSection>
      <FeatureSection
        title="Where to Find Us">
        <p class="max-w-2xl mb-6">
          <strong>The Waterfront Beach Resort </strong>
          <span class="text-gray-600 ">is located approximately less than 18km from Subic Safari & Ocean Adventure and is approximately 47km away from Dambana ng Kagitingan (Mt. Samat) going north. We offer guests the convenience of outdoor parking with in-and-out privileges. The resort has approximately 1800 sq. feet of parking area exclusive for resort guests only.</span>
        </p>
        <MapGoogle
          origin="NAIA Terminal 1, Pasay, Metro Manila"
          destination="Waterfront Beach Resort, Bataan"
        />
      </FeatureSection>
      <AmenitiesSection />
    </>
  );
}
