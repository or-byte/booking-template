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
    line1: "Sitio Pasinay, Barangay Nagbalayong",
    city: "Morong",
    region: "Bataan",
    country: "Philippines",
    postal: "2108",
  },
  phone: "+63 912 345 6789",
  phoneAlt: "+63 47 123 4567",
  email: "stay@thewaterfrontbeachresort.com",
  website: "thewaterfrontbeachresort.com",
  checkIn: "2:00 PM",
  checkOut: "12:00 NN",
  socials: [
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
    { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" as const },
  ],
} as const;

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
  hero: "/images/hero_img.jpg",
  logo: "/images/waterfront_logo.png",

  /** One per room type, in the order the rooms are listed. */
  rooms: [
    unsplash("1618773928121-c32242e63f39"),
    unsplash("1611892440504-42a792e24d32"),
    unsplash("1631049307264-da0ec9d70304"),
    unsplash("1616594039964-ae9021a400a0"),
  ],

  dining: [
    unsplash("1559339352-11d035aa65de"),
    unsplash("1517248135467-4c7edcad34c4"),
    unsplash("1414235077428-338989a2e8c0"),
  ],

  /** Matched to the three entries in `experiences`, in order. */
  explore: [
    unsplash("1507525428034-b723cf961d3e"),
    unsplash("1470071459604-3b5ec3a7fe05"),
    unsplash("1506929562872-bb421503ef21"),
  ],

  resort: unsplash("1566073771259-6a8506099945"),
  pool: unsplash("1520250497591-112f2f40a3f4"),
  spa: unsplash("1544161515-4ab6ce6db874"),
  shore: unsplash("1540541338287-41700207dee6"),
  dusk: unsplash("1571003123894-1f0594d2b5d9"),
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
   Experiences around the resort — all real places within reach of Morong.
   ------------------------------------------------------------------------- */

export const experiences = [
  {
    title: "Pawikan Conservation Center",
    distance: "5 minutes away",
    description:
      "A community-run hatchery in Nagbalayong. From November to February, guests join the evening release of olive ridley hatchlings.",
    image: photos.explore[0],
  },
  {
    title: "Mount Samat Shrine",
    distance: "1 hour away",
    description:
      "The Shrine of Valor above Pilar, with the memorial cross and a viewing gallery that takes in the whole peninsula.",
    image: photos.explore[1],
  },
  {
    title: "Five Fingers Cove",
    distance: "Boat from the resort",
    description:
      "The finger-shaped coves along the Mariveles coastline — clear water, high rock walls, and a half-day boat trip.",
    image: photos.explore[2],
  },
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
  { value: "180 m", label: "of private shoreline" },
  { value: "24", label: "rooms, suites and casitas" },
  { value: "3 hrs", label: "from Metro Manila" },
  { value: "1998", label: "welcoming guests since" },
];

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
