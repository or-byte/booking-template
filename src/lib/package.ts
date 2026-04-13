import { Package as PrismaPackage, PackageItem as PrismaPackageItem } from "@prisma/client"
import { User } from "./user";
import prisma from "./prisma";

export const PackageStatus = {
  CREATED: "CREATED",
  MODIFIED: "MODIFIED",
  REVIEWED: "REVIEWED",
  APPROVED: "APPROVED"
} as const;

export type PackageStatus = (typeof PackageStatus)[keyof typeof PackageStatus];

export type PackageItem = Omit<PrismaPackageItem, "price"> & {
  name: string
  price: number
};

export type Package = Omit<PrismaPackage, "overridePrice"> & {
  packageItems: PackageItem[]
  createdBy: User
  reviewedBy: User | null
  approvedBy: User | null
  updatedBy: User | null
  overridePrice?: number
  status: PackageStatus
};

export type PackageFormData = {
  createdById: number
  description: string
  packageItems: PackageItemFormData[]
  overridePrice?: number
}

export type PackageItemFormData = {
  productId: number
  quantity: number
  price: number
}

export type UpdatePackageFormData = {
  description?: string
  reviewedById?: number | null
  approvedById?: number | null
  updatedById?: number | null
  packageItems?: PackageItemFormData[]
  overridePrice?: number
}

export const getAllPackages = async (
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

  const [results, total] = await Promise.all([
    prisma.package.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        packageItems: {
          include: { product: true },
        },
        createdBy: true,
        reviewedBy: true,
        approvedBy: true,
        updatedBy: true,
      },
      orderBy: {
        id: "asc"
      },
    }),
    prisma.package.count({ where })
  ]);

  return {
    data: results.map((p) => formatPackage(p)),
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    }
  };
}

export const getPackageById = async (id: number) => {
  "use server"

  const result = prisma.package.findUnique({
    where: { id },
    include: {
      packageItems: {
        include: { product: true },
      },
      createdBy: true,
      reviewedBy: true,
      approvedBy: true,
      updatedBy: true
    },
  });

  if (!result) throw new Error("No result");

  return formatPackage(result);
}

export const createPackage = async (form: PackageFormData): Promise<Package> => {
  "use server"

  const result = await prisma.package.create({
    data: {
      createdById: form.createdById,
      description: form.description,
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
      createdBy: true,
      reviewedBy: true,
      approvedBy: true,
      updatedBy: true
    },
  });

  if (!result) throw new Error("No result");

  return formatPackage(result);
}

export const updatePackage = async (id: number, form: UpdatePackageFormData): Promise<Package> => {
  "use server"

  const updatedById = form.updatedById || form.reviewedById || form.approvedById;

  const result = await prisma.package.update({
    where: { id },
    data: {
      description: form.description,
      reviewedById: form.reviewedById,
      approvedById: form.approvedById,
      updatedById: updatedById,
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
      createdBy: true,
      reviewedBy: true,
      approvedBy: true,
      updatedBy: true
    },
  });

  if (!result) throw new Error("No result");

  return formatPackage(result);
}

export const addItemsToPackage = async (packageId: number, items: PackageItemFormData[]) => {
  "use server"

  return prisma.packageItem.createMany({
    data: items.map(item => ({
      packageId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
  });
}

export const deletePackage = async (id: number) => {
  "use server"

  await prisma.packageItem.deleteMany({
    where: { packageId: id },
  });

  await prisma.package.delete({
    where: { id },
  });
}


export function getPackageStatus(pkg: any): PackageStatus {
  if (pkg.approvedBy) return PackageStatus.APPROVED;
  if (pkg.reviewedBy) return PackageStatus.REVIEWED;
  if (pkg.updatedBy && pkg.updatedAt !== pkg.createdAt) return PackageStatus.MODIFIED;
  return PackageStatus.CREATED;
}

export function formatPackage(pkg: any): Package {
  return ({
    ...pkg,
    status: getPackageStatus(pkg),
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