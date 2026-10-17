import { query } from "@solidjs/router";
import { fallbackRooms, photos, type RoomHighlight } from "~/data/site";

/**
 * Rooms for the public marketing pages.
 *
 * The catalogue is the source of truth once it is seeded, but a resort site
 * that renders an empty page is worse than one showing sample rooms — so an
 * unreachable database or an unseeded catalogue falls back to the sample set in
 * `data/site.ts` rather than surfacing an error to a prospective guest.
 */
export const getRooms = query(async (): Promise<RoomHighlight[]> => {
  "use server";

  try {
    // Imported inside the guard: constructing the client throws outright when
    // it has not been generated, and that must fall back rather than 500.
    const { default: prisma } = await import("./prisma");

    const products = await prisma.product.findMany({
      where: { category: { name: "Room" } },
      include: { rooms: true },
      orderBy: { price: "asc" },
    });

    if (products.length === 0) return fallbackRooms;

    return products.map((product, i) => {
      const room = product.rooms[0];
      const sample = fallbackRooms[i % fallbackRooms.length];

      return {
        id: product.id,
        name: room?.name ?? product.name,
        price: product.price.toNumber(),
        description: product.description || sample.description,
        capacity: room?.capacity ?? sample.capacity,
        // Dimensions, bedding and photography are not modelled yet; borrow the
        // sample presentation so the layout stays complete until they are.
        size: sample.size,
        bed: sample.bed,
        view: sample.view,
        image: photos.rooms[i % photos.rooms.length],
        features: sample.features,
      } satisfies RoomHighlight;
    });
  } catch (error) {
    console.warn("[rooms] database unavailable, serving sample rooms:", error);
    return fallbackRooms;
  }
}, "public-rooms");
