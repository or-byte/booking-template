import prisma from "~/lib/prisma";

async function main() {
  await prisma.user.create({
    data: {
      name: "Ark Faith Lumacad",
      email: "arkclumacad@gmail.com",
      role: "ADMIN"
    }
  })

  const room = await prisma.category.create({
    data: {
      name: "Room",
      description: "Types of room"
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


  const deluxe = await prisma.product.create({
    data: {
      name: "Deluxe",
      description: "Our fully air-conditioned Deluxe Room features one queen bed, one double bed, bathroom with walk-in shower, and balcony of our Partial View Seascape. This is a non-smoking room. Included: Free breakfast for four.",
      price: 5400.00,
      categoryId: room.id
    }
  });

  const superior = await prisma.product.create({
    data: {
      name: "Superior",
      description: "Our Superior Room features two double beds and bathroom with walk-in shower, as well as, a wall out balcony of our partial view seascape. Included: Free breakfast for four persons.",
      price: 5000.00,
      categoryId: room.id
    }
  });

  const standard = await prisma.product.create({
    data: {
      name: "Standard",
      description: "Our Standard Room has a partial overlook of the ocean featuring one double bed with a walk-in bathroom & shower, with free breakfast for two.",
      price: 2800.00,
      categoryId: room.id
    }
  });

  const loft = await prisma.product.create({
    data: {
      name: "Loft",
      description: "Our Dormitory Room accommodates up to 20 people with 2 bathrooms and 2 walk-in showers rooms.",
      price: 11200.00,
      categoryId: room.id
    }
  });


  const dormOld = await prisma.product.create({
    data: {
      name: "Dormitory Old",
      description: "Our Dormitory Room accommodates up to 20 people with 2 bathrooms and 2 walk-in showers rooms.",
      price: 17200.00,
      categoryId: room.id
    }
  });

  const dormNew = await prisma.product.create({
    data: {
      name: "Dormitory New",
      description: "Our Dormitory Room accommodates up to 20 people with 2 bathrooms and 2 walk-in showers rooms.",
      price: 21100.00,
      categoryId: room.id
    }
  });

  const excessPerson = await prisma.product.create({
    data: {
      name: "Excess Person",
      description: "Extra person",
      price: 1000.00,
      categoryId: room.id
    }
  })


  await prisma.room.createMany({
    data: [
      {
        name: "DELUXE 1",
        productId: deluxe.id,
        capacity: 4
      },
      {
        name: "DELUXE 2",
        productId: deluxe.id,
        capacity: 4
      },
      {
        name: "SUPERIOR 1",
        productId: superior.id,
        capacity: 4
      },
      {
        name: "SUPERIOR 2",
        productId: superior.id,
        capacity: 4
      },
      {
        name: "STANDARD 1",
        productId: standard.id,
        capacity: 2
      },
      {
        name: "STANDARD 2",
        productId: standard.id,
        capacity: 2
      },
      {
        name: "DORMITORY 1",
        productId: dormOld.id,
        capacity: 20
      },
      {
        name: "DORMITORY 2",
        productId: dormOld.id,
        capacity: 20
      },
    ]
  })

  await prisma.product.createMany({
    data: [
      {
        name: "Dental Kit",
        description: "Toothbrush plus toothpaste",
        price: 50.00,
        categoryId: hygiene.id
      },
      {
        name: "Slippers",
        description: "Room friendly slipper",
        price: 67.00,
        categoryId: clothing.id
      },
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect()
  })