import prisma from "~/lib/prisma";
import { createNewCategory } from "~/lib/category";
import { createNewProduct } from "~/lib/product";

async function main() {
    const hygiene = await prisma.category.create({
        data: {
            name: "Hygiene",
            description: "Personal care products"
        }
    })

    const clothing = await prisma.category.create({
        data: {
            name: "Clothing",
            description: "Collection of wearables"
        }
    })

    const room = await prisma.category.create({
        data: {
            name: "Room",
            description: "Types of room"
        }
    })

    await prisma.product.createMany({
        data: [
            {
                sku: "HYG-001-DK",
                name: "Dental Kit",
                description: "Toothbrush plus toothpaste",
                price: 50.00,
                categoryId: hygiene.id
            },
            {
                sku: "HYG-002-SLPR",
                name: "Slipper",
                description: "Room friendly slipper",
                price: 67.00,
                categoryId: clothing.id
            },
            {
                sku: "ROOM-001-DLX",
                name: "Deluxe",
                description: "Our fully air-conditioned Deluxe Room features one queen bed, one double bed, bathroom with walk-in shower, and balcony of our Partial View Seascape. This is a non-smoking room. Included: Free breakfast for four.",
                price: 5400.00,
                categoryId: room.id
            },
            {
                sku: "ROOM-002-SUP",
                name: "Superior",
                description: "Our Superior Room features two double beds and bathroom with walk-in shower, as well as, a wall out balcony of our partial view seascape. Included: Free breakfast for four persons.",
                price: 5000.00,
                categoryId: room.id
            },
            {
                sku: "ROOM-003-STD",
                name: "Standard",
                description: "Our Standard Room has a partial overlook of the ocean featuring one double bed with a walk-in bathroom & shower, with free breakfast for two.",
                price: 2800.00,
                categoryId: room.id
            },
            {
                sku: "ROOM-004-DORM",
                name: "Dormitory",
                description: "Our Dormitory Room accommodates up to 12 people with 2 bathrooms and 2 walk-in showers rooms.",
                price: 12000.00,
                categoryId: room.id
            }
        ]
    })

    const deluxe = await prisma.product.findFirst({ where: { name: "Deluxe" } });
    const superior = await prisma.product.findFirst({ where: { name: "Superior" } });
    const standard = await prisma.product.findFirst({ where: { name: "Standard" } });
    const dormitory = await prisma.product.findFirst({ where: { name: "Dormitory" } });

    await prisma.room.createMany({
        data: [
            {
                name: "DLX-01",
                capacity: 4,
                productId: deluxe!.id
            },
            {
                name: "DLX-02",
                capacity: 4,
                productId: deluxe!.id
            },
            {
                name: "SUP-01",
                capacity: 4,
                productId: superior!.id
            },
            {
                name: "SUP-02",
                capacity: 4,
                productId: superior!.id
            },
            {
                name: "STD-01",
                capacity: 2,
                productId: standard!.id
            },
            {
                name: "STD-02",
                capacity: 2,
                productId: standard!.id
            },
            {
                name: "DRM-01",
                capacity: 12,
                productId: dormitory!.id
            },
            {
                name: "DRM-02",
                capacity: 12,
                productId: dormitory!.id
            },
        ]
    })
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect()
    })