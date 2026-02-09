import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.roomType.deleteMany();

    await prisma.roomType.create({
        data: {
            name: "Deluxe Room",
            description: "Our fully air-conditioned Deluxe Room features one queen bed, one double bed, bathroom with walk-in shower, and balcony of our Partial View Seascape. This is a non-smoking room. Included: Free breakfast for four.",
            price: 5400.00,
            capacity: 4
        }
    })

    await prisma.roomType.create({
        data: {
            name: "Superior Room",
            description: "Our Superior Room features two double beds and bathroom with walk-in shower, as well as, a wall out balcony of our partial view seascape. Included: Free breakfast for four persons.",
            price: 5000.00,
            capacity: 4
        }
    })

    await prisma.roomType.create({
        data: {
            name: "Standard Room",
            description: "Our Standard Room has a partial overlook of the ocean featuring one double bed with a walk-in bathroom & shower, with free breakfast for two.",
            price: 2800.00,
            capacity: 2
        }
    })

    await prisma.roomType.create({
        data: {
            name: "Dormitory Room",
            description: "Our Dormitory Room accommodates up to 12 people with 2 bathrooms and 2 walk-in showers rooms.",
            price: 12000.00,
            capacity: 12
        }
    })

    const hygiene = await prisma.category.create({
        data: {
            name: "Hygiene",
            description: "Collection of hygienic items"
        }
    })

    const clothing = await prisma.category.create({
        data: {
            name: "Clothing",
            description: "Collectino of clothing items"
        }
    })

    await prisma.product.create({
        data: {
            sku: "HTL-PST-001",
            name: "Toothpaste",
            description: "Hotel Toothpaste",
            price: 50.00,
            stockQty: 10,
            categoryId: hygiene.id
        }
    })

    await prisma.product.create({
        data: {
            sku: "HTL-SLP-001",
            name: "Slipper",
            description: "Hotel Slipper",
            price: 100.00,
            stockQty: 10,
            categoryId: clothing.id
        }
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