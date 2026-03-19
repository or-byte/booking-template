import { Package as PrismaPackage, PackageItem as PrismaPackageItem } from "@prisma/client"
import prisma from "./prisma";
import { User } from "./user";

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

  const packages = await prisma.package.findMany({
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

  return packages.map((p) => ({
    ...p,
    packageItems: p.packageItems.map(({ product, ...i }) => ({
      ...i,
      name: product.name,
      price: Number(product.price)
    })),
    createdBy: p.createdBy,
    reviewedBy: p.reviewedBy,
    approvedBy: p.approvedBy,
    updatedBy: p.updatedBy
  }));
}

export const getPackageById = async (id: number) => {
  "use server"

  return prisma.package.findUnique({
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
}

export const createPackage = async (form: PackageFormData): Promise<Package> => {
  "use server"

  const pkg = await prisma.package.create({
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

  return ({
    ...pkg,
    packageItems: pkg.packageItems.map(({ product, ...i }) => ({
      ...i,
      name: product.name,
      price: Number(product.price)
    })),
    createdBy: pkg.createdBy,
    reviewedBy: pkg.reviewedBy,
    approvedBy: pkg.approvedBy,
    updatedBy: pkg.updatedBy
  });
}

export const updatePackage = async (id: number, form: UpdatePackageFormData): Promise<Package> => {
  "use server"

  const updatedById = form.updatedById || form.reviewedById || form.approvedById;

  const pkg = await prisma.package.update({
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

  return ({
    ...pkg,
    packageItems: pkg.packageItems.map(({ product, ...i }) => ({
      ...i,
      name: product.name,
      price: Number(product.price)
    })),
    createdBy: pkg.createdBy,
    reviewedBy: pkg.reviewedBy,
    approvedBy: pkg.approvedBy,
    updatedBy: pkg.updatedBy
  });
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
    })),
    createdBy: pkg.createdBy,
    reviewedBy: pkg.reviewedBy,
    approvedBy: pkg.approvedBy,
    updatedBy: pkg.updatedBy
  });
}