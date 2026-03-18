import { Package as PrismaPackage, PackageItem as PrismaPackageItem } from "@prisma/client"
import prisma from "./prisma";
import { User } from "./user";

export type PackageItem = Omit<PrismaPackageItem, "price"> & { name: string, price: number };
export type Package = PrismaPackage & { packageItems: PackageItem[], createdBy: User, reviewedBy: User, approvedBy: User };

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
  packageItems?: PackageItemFormData[]
}

export const getAllPackages = async () : Promise<Package> => {
  "use server"

  const packages = await prisma.package.findMany({
    include: {
      packageItems: {
        include: { product: true },
      },
      createdBy: true,
      reviewedBy: true,
      approvedBy: true,
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
    approvedBy: p.approvedBy
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
    },
  });
}

export const createPackage = async (form: PackageFormData) => {
  "use server"

  return prisma.package.create({
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
      packageItems: true,
    },
  });
}

export const updatePackage = async (id: number, form: UpdatePackageFormData) => {
  "use server"

  return prisma.package.update({
    where: { id },
    data: {
      description: form.description,
      reviewedById: form.reviewedById,
      approvedById: form.approvedById,
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
      packageItems: true,
    },
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