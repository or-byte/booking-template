import prisma from "~/lib/prisma";

async function main() {
    await prisma.user.create({
        data: {
            fullName: "Ark Faith Lumacad",
            email: "arkclumacad@gmail.com",
            role: "ADMIN"
        }
    })
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
                sku: "CLO-001-SLPR",
                name: "Slippers",
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
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect()
    })