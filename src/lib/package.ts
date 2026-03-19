import { Package as PrismaPackage, PackageItem as PrismaPackageItem } from "@prisma/client"
import { User } from "./user";
import prisma from "./prisma";

export type PackageItem = Omit<PrismaPackageItem, "price"> & {
  name: string
  price: number
};

export type Package = PrismaPackage & {
  packageItems: PackageItem[]
  createdBy: User
  reviewedBy: User | null
  approvedBy: User | null
  updatedBy: User | null
};

export type PackageFormData = {
  createdById: number
  description: string
  packageItems: PackageItemFormData[]
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
}

export const PackageStatus = {
  CREATED: "CREATED",
  MODIFIED: "MODIFIED",
  REVIEWED: "REVIEWED",
  APPROVED: "APPROVED"
} as const;

export const getAllPackages = async (): Promise<Package[]> => {
  "use server"

  const results = await prisma.package.findMany({
    include: {
      packageItems: {
        include: { product: true },
      },
      createdBy: true,
      reviewedBy: true,
      approvedBy: true,
      updatedBy: true
    },
    orderBy: {
      id: "asc"
    }
  });

  return results.map((p) => formatPackage(p));
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
          price: item.price,
        })),
      },
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
            price: item.price,
          })),
        },
      }),
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

  return prisma.package.delete({
    where: { id },
  });
}

export function formatPackage(pkg: any) : Package {
  return ({
    ...pkg,
    packageItems: pkg.packageItems.map(({ product, ...i }) => ({
      ...i,
      name: product.name,
      price: Number(product.price)
    }))
  });
}