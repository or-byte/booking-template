import { Package as PrismaPackage, PackageItem as PrismaPackageItem, PackageEvent as PrismaPackageEvent } from "@prisma/client"
import prisma from "./prisma";
import { action, query } from "@solidjs/router";
import { User } from "./user";

// This mirrors `PackageEventType` enum from schema
export const PackageEventType = {
  CREATED: "CREATED",
  MODIFIED: "MODIFIED",
  REVIEWED: "REVIEWED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED"
} as const;

export type PackageEventType = (typeof PackageEventType)[keyof typeof PackageEventType];

export const PACKAGE_EVENT_DESCRIPTION = {
  create: "Package proposal created",
  modify: "Package proposal has been modified",
  review: "Package proposal has been reviewed",
  approve: "Package proposal has been approved",
  reject: "Package proposal has been rejected",
  cancel: "Package proposal has been cancelled"
}

export type PackageEvent = Omit<PrismaPackageEvent, "packageId"> & {
  createdBy: User
};

export type PackageItem = Omit<PrismaPackageItem, "price"> & {
  name: string
  price: number
};

export type Package = Omit<PrismaPackage, "overridePrice"> & {
  packageItems: PackageItem[]
  packageEvents: PackageEvent[]
  overridePrice?: number
  status: PackageEventType
}

export type PackageFormData = {
  companyName: string
  contactNumber: string
  contactEmail: string
  numberOfGuests: number
  reservationDate?: Date
  eventDate: Date
  description?: string
  packageItems: PackageItemFormData[]
  overridePrice?: number
  userId: string
}

export type PackageItemFormData = {
  productId: number
  quantity: number
  price: number
}

export type UpdatePackageFormData = {
  companyName?: string
  contactEmail?: string
  contactNumber?: string
  numberOfGuests?: number
  reservationDate?: Date
  eventDate?: Date
  description?: string
  packageItems?: PackageItemFormData[]
  overridePrice?: number
}

export const getAllPackages = query(async (
  page: number = 1,
  pageSize: number = 5,
  search?: string
): Promise<{
  data: Package[],
  meta: {
    page: number,
    pageSize: number,
    total: number,
    totalPages: number
  }
}> => {
  "use server"

  const safePage = Math.max(page, 1);
  const skip = (safePage - 1) * pageSize;

  const where = search
    ? {
      description: {
        contains: search,
        mode: "insensitive" as const,
      },
    }
    : undefined;

  const result = await prisma.$transaction(async (tx) => {
    const packages = await tx.package.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        packageItems: {
          include: { product: true }
        },
        packageEvents: {
          orderBy: {
            id: "desc"
          }
        }
      },
      orderBy: {
        id: "asc"
      }
    });

    const total = await tx.package.count({ where })

    // this will always get the latest `Package Event`
    // `p.packageEvents` is never empty because `createPackage` also creates a `Package Event`
    const mappedPackages = packages.map((p) => {
      const pkg = {
        ...p,
        status: p.packageEvents[0].type
      }
      return mapPackage(pkg)
    });

    return { packages: mappedPackages, total };
  });

  return {
    data: result.packages,
    meta: {
      page,
      pageSize,
      total: result.total,
      totalPages: Math.ceil(result.total / pageSize),
    }
  };
},
  "get-all-packages"
);


export const getPackageById = query(async (id: number): Promise<Package> => {
  "use server"

  const result = prisma.package.findUnique({
    where: { id },
    include: {
      packageItems: {
        include: { product: true },
      }
    },
  });

  if (!result) throw new Error("No result");

  return mapPackage(result);
},
  "get-package-by-id"
);

export const getPackageEvents = query(async (packageId: number) => {
  "use server"

  const result = await prisma.packageEvent.findMany({
    where: { packageId },
    include: {
      createdBy: true
    }
  });

  return result;
},
  "get-package-events"
)

export const createPackageAction = action(async (form: PackageFormData) => {
  "use server"

  try {
    await prisma.$transaction(async (tx) => {
      const pkg = await tx.package.create({
        data: {
          companyName: form.companyName,
          contactNumber: form.contactNumber,
          contactEmail: form.contactEmail,
          numberOfGuests: form.numberOfGuests,
          eventDate: form.eventDate,
          description: form.description ?? "Created Via Package Proposal Form",
          packageItems: {
            create: form.packageItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
          overridePrice: form.overridePrice
        },
        include: {
          packageItems: {
            include: { product: true }
          },
        },
      });

      await tx.packageEvent.create({
        data: {
          packageId: pkg.id,
          type: PackageEventType.CREATED,
          createdById: form.userId,
          description: PACKAGE_EVENT_DESCRIPTION.create
        }
      });
    });
  }
  catch (err) {
    console.error(err);
  }
},
  "create-package"
);

export const updatePackageAction = action(async (id: number, userId: string, form: UpdatePackageFormData) => {
  "use server"

  await prisma.$transaction(async (tx) => {
    const updatedPkg = await prisma.package.update({
      where: { id },
      data: {
        companyName: form.companyName,
        contactNumber: form.contactNumber,
        contactEmail: form.contactEmail,
        description: form.description,
        ...(form.packageItems && {
          packageItems: {
            deleteMany: {},
            create: form.packageItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        }),
        overridePrice: form.overridePrice
      },
      include: {
        packageItems: {
          include: { product: true }
        },
      },
    });

    const event = await tx.packageEvent.create({
      data: {
        packageId: updatedPkg.id,
        type: PackageEventType.MODIFIED,
        createdById: userId,
        description: PACKAGE_EVENT_DESCRIPTION.modify
      }
    });

    const pkg = {
      ...updatedPkg,
      status: event.type
    }
  });
},
  "update-package"
);

export const reviewPackageAction = action(async (packageId: number, userId: string) => {
  "use server"

  await prisma.packageEvent.create({
    data: {
      packageId,
      type: PackageEventType.REVIEWED,
      createdById: userId,
      description: PACKAGE_EVENT_DESCRIPTION.review
    }
  })
},
  "review-package"
)

export const approvePackageAction = action(async (packageId: number, userId: string) => {
  "use server"

  await prisma.packageEvent.create({
    data: {
      packageId,
      type: PackageEventType.APPROVED,
      createdById: userId,
      description: PACKAGE_EVENT_DESCRIPTION.approve
    }
  });
},
  "approve-package"
)

export const rejectPackageAction = action(async (packageId: number, userId: string) => {
  "use server"

  await prisma.packageEvent.create({
    data: {
      packageId,
      type: PackageEventType.REJECTED,
      createdById: userId,
      description: PACKAGE_EVENT_DESCRIPTION.reject
    }
  });
},
  "reject-package"
);

export const cancelPackageAction = action(async (packageId: number, userId: string) => {
  "use server"

  await prisma.packageEvent.create({
    data: {
      packageId,
      type: PackageEventType.CANCELLED,
      createdById: userId,
      description: PACKAGE_EVENT_DESCRIPTION.cancel
    }
  });
},
  "cancel-package"
);

export const deletePackage = async (id: number) => {
  "use server"

  await prisma.package.delete({
    where: { id },
  });
}

export function mapPackage(pkg: any): Package {
  return ({
    ...pkg,
    packageItems: pkg.packageItems.map(({ product, ...i }) => ({
      ...i,
      name: product.name,
      price: Number(product.price)
    })),
    overridePrice: Number(pkg.overridePrice)
  });
}

export function calculatePrice(pkg: Package): number {
  return pkg.packageItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}