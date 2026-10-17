/**
 * Single source of truth for marketing copy and imagery.
 *
 * Everything here is placeholder content chosen to be plausible for a resort in
 * Morong, Bataan. Swap the strings and the `photos` URLs for the client's own
 * copy and photography before launch — no component hard-codes content, so the
 * whole site re-skins from this file.
 */

export const site = {
  name: "The Waterfront Beach Resort",
  shortName: "The Waterfront",
  tagline: "Where the West Philippine Sea meets the Bataan shore",
  description:
    "A quiet beachfront retreat in Morong, Bataan — sunset views over the West Philippine Sea, unhurried rooms, and the kind of stay you plan the rest of the year around.",
  address: {
    line1: "Crossing, Barangay Nagbalayong",
    city: "Morong",
    region: "Bataan",
    country: "Philippines",
    postal: "2108",
  },
  /** Primary mobile, shown in the navbar and footer. */
  phone: "0917 137 4375",
  mobiles: ["0917 137 4375", "0919 991 2480", "0917 137 9848"],
  telephone: "(047) 676 2250",
  email: "marketing@thewaterfrontbeachresort.com",
  website: "thewaterfrontbeachresort.com",
  checkIn: "2:00 PM",
  checkOut: "12:00 NN",
  socials: [
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
    { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" as const },
  ],
} as const;

/** Builds a tel: href from a display number. */
export const telHref = (number: string) => `tel:${number.replace(/[^\d+]/g, "")}`;

export const fullAddress = `${site.address.line1}, ${site.address.city}, ${site.address.region}`;

/** Journey origin used by the directions map. */
export const travel = {
  origin: "NAIA Terminal 1, Pasay, Metro Manila",
  destination: "Waterfront Beach Resort, Morong, Bataan",
};

/* ---------------------------------------------------------------------------
   Photography
   Replace every URL below with the resort's own images. Local files belong in
   /public/images and are referenced as "/images/<file>".
   ------------------------------------------------------------------------- */

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const photos = {
  hero: "/images/hero-sunset.jpg",
  logo: "/images/waterfront_logo.png",

  /** One per room type, in the order the rooms are listed. */
  rooms: [
    "/images/room-twin.jpg",
    "/images/room-loft.jpg",
    "/images/room-loft-twin.jpg",
    "/images/room-dormitory.jpg",
  ],

  dining: [
    "/images/dining-bar.jpg",
    "/images/dining-beachside.jpg",
    "/images/dining-cottage.jpg",
  ],

  /** Matched to the three entries in `experiences`, in order. Stock images until
   *  the resort supplies photos of these places. */
  explore: [
    unsplash("1507525428034-b723cf961d3e"),
    unsplash("1470071459604-3b5ec3a7fe05"),
    unsplash("1506929562872-bb421503ef21"),
  ],

  resort: "/images/resort-building.jpg",
  pool: "/images/pool.jpg",
  spa: "/images/cabanas.jpg",
  shore: "/images/shore.jpg",
  dusk: "/images/beach-hut.jpg",
};

/* ---------------------------------------------------------------------------
   Rooms
   The live site reads rooms from the database. These entries are the fallback
   used when the catalogue has not been seeded yet, and they document the shape
   the marketing pages expect.
   ------------------------------------------------------------------------- */

export type RoomHighlight = {
  id: number;
  name: string;
  price: number;
  description: string;
  capacity: number;
  size: string;
  bed: string;
  view: string;
  image: string;
  features: string[];
};

export const fallbackRooms: RoomHighlight[] = [
  {
    id: 1,
    name: "Seaview Deluxe",
    price: 6500,
    description:
      "A corner room facing due west, with a private balcony wide enough for two chairs and the whole sunset.",
    capacity: 2,
    size: "32 sqm",
    bed: "1 King bed",
    view: "Sea view",
    image: photos.rooms[0],
    features: ["Private balcony", "Air conditioning", "Rain shower", "Daily breakfast"],
  },
  {
    id: 2,
    name: "Garden Casita",
    price: 4800,
    description:
      "Set back among the palms, a few steps from the shore and shaded through the warm part of the day.",
    capacity: 3,
    size: "28 sqm",
    bed: "1 Queen + 1 Single",
    view: "Garden view",
    image: photos.rooms[1],
    features: ["Garden terrace", "Air conditioning", "Mini refrigerator", "Daily breakfast"],
  },
  {
    id: 3,
    name: "Family Loft",
    price: 9200,
    description:
      "Two levels, sleeping five, with a lower lounge that opens straight onto the lawn and the beach beyond.",
    capacity: 5,
    size: "54 sqm",
    bed: "1 King + 2 Singles",
    view: "Partial sea view",
    image: photos.rooms[2],
    features: ["Two floors", "Living area", "Kitchenette", "Daily breakfast"],
  },
  {
    id: 4,
    name: "Beachfront Suite",
    price: 12500,
    description:
      "The closest room to the water — a private deck, an outdoor shower, and nothing between you and the sea.",
    capacity: 2,
    size: "62 sqm",
    bed: "1 King bed",
    view: "Beachfront",
    image: photos.rooms[3],
    features: ["Private deck", "Outdoor shower", "Lounge area", "Daily breakfast"],
  },
];

/* ---------------------------------------------------------------------------
   Amenities
   ------------------------------------------------------------------------- */

export type AmenityIcon =
  | "wifi"
  | "pool"
  | "dining"
  | "parking"
  | "aircon"
  | "beach"
  | "service"
  | "bar"
  | "events"
  | "spa";

export const amenities: { label: string; note: string; icon: AmenityIcon }[] = [
  { label: "Beachfront access", note: "Private stretch of grey-sand shore", icon: "beach" },
  { label: "Infinity pool", note: "Open from 6 AM to 10 PM", icon: "pool" },
  { label: "El Mar restaurant", note: "Filipino and coastal plates", icon: "dining" },
  { label: "Beach bar", note: "Sunset service until late", icon: "bar" },
  { label: "Fast Wi-Fi", note: "Throughout rooms and public areas", icon: "wifi" },
  { label: "Air-conditioned rooms", note: "Every room, every night", icon: "aircon" },
  { label: "Free parking", note: "Secure, on-site, no charge", icon: "parking" },
  { label: "24-hour front desk", note: "Room service on request", icon: "service" },
  { label: "Events pavilion", note: "Weddings and retreats up to 120", icon: "events" },
  { label: "Seaside cabanas", note: "Massage and treatments by the water", icon: "spa" },
];

/* ---------------------------------------------------------------------------
   Experiences around the resort, from the resort's nearby places sheet.
   ------------------------------------------------------------------------- */

export const experiences = [
  {
    title: "Pawikan Conservation Center",
    distance: "1.87 km away",
    description:
      "A community-run hatchery in Nagbalayong. From November to February, guests join the evening release of olive ridley hatchlings.",
    image: photos.explore[0],
  },
  {
    title: "The Boat People Museum",
    distance: "5.34 km away",
    description:
      "The story of the Philippine Refugee Processing Center, which sheltered Indochinese refugees in Morong from 1980 to 1994.",
    image: photos.explore[1],
  },
  {
    title: "Kairukan Falls",
    distance: "8.07 km away",
    description:
      "A short trek inland to a cool forest pool, a good change of pace from a morning on the beach.",
    image: photos.explore[2],
  },
];

/** Straight-line distances from the resort; actual travel distances may vary. */
export const nearbyPlaces = [
  { name: "Pawikan Conservation Center", distance: "1.87 km" },
  { name: "Our Lady of the Pillar Parish Church", distance: "2.43 km" },
  { name: "Morong Municipal Hall and Health Center", distance: "2.44 km" },
  { name: "Vietnamese Memorial Park", distance: "4.28 km" },
  { name: "Buddhist Shrine", distance: "4.78 km" },
  { name: "The Boat People Museum", distance: "5.34 km" },
  { name: "Camp Kanawan", distance: "5.36 km" },
  { name: "Kairukan Falls", distance: "8.07 km" },
  { name: "Among Pulo Cove", distance: "8.45 km" },
  { name: "Zoobic Safari", distance: "9.70 km" },
  { name: "Botanical Garden", distance: "9.72 km" },
];

/* ---------------------------------------------------------------------------
   Dining
   ------------------------------------------------------------------------- */

export const dining = {
  name: "El Mar",
  kicker: "Restaurant & Beach Bar",
  description:
    "Breakfast on the deck, long lunches under the palms, and a dinner menu that leans on what the Morong boats brought in that morning.",
  hours: [
    { label: "Breakfast", value: "6:30 – 10:00 AM" },
    { label: "Lunch", value: "11:30 AM – 2:30 PM" },
    { label: "Dinner", value: "6:00 – 10:00 PM" },
    { label: "Beach bar", value: "4:00 PM – midnight" },
  ],
};

/* ---------------------------------------------------------------------------
   Small proof points used in the "at a glance" band.
   ------------------------------------------------------------------------- */

export const glance = [
  { value: "180 m", label: "of private shoreline", icon: "shore" },
  { value: "24", label: "rooms, suites and casitas", icon: "key" },
  { value: "3 hrs", label: "from Metro Manila", icon: "car" },
  { value: "1998", label: "welcoming guests since", icon: "heart" },
] as const;

/* ---------------------------------------------------------------------------
   Navigation
   ------------------------------------------------------------------------- */

export const primaryNav = [
  { href: "/about", label: "About Us" },
  { href: "/rooms", label: "Rooms" },
  {
    href: "/explore",
    label: "Explore",
    children: [
      { href: "/explore#dining", label: "Dining" },
      { href: "/explore#facilities", label: "Facilities" },
      { href: "/explore#attractions", label: "Attractions" },
      { href: "/explore#gallery", label: "Gallery" },
    ],
  },
  { href: "/contact", label: "Contact Us" },
] as const;
