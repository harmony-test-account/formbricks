import "server-only";

import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { z } from "zod";

import { prisma } from "@formbricks/database";
import { ZString } from "@formbricks/types/common";
import { TEnvironment, ZId } from "@formbricks/types/environment";
import { DatabaseError, ValidationError } from "@formbricks/types/errors";
import type { TProduct, TProductUpdateInput } from "@formbricks/types/product";
import { ZProduct, ZProductUpdateInput } from "@formbricks/types/product";

import { SERVICES_REVALIDATION_INTERVAL, isS3Configured } from "../constants";
import { environmentCache } from "../environment/cache";
import { createEnvironment } from "../environment/service";
import { deleteLocalFilesByEnvironmentId, deleteS3FilesByEnvironmentId } from "../storage/service";
import { formatDateFields } from "../utils/datetime";
import { validateInputs } from "../utils/validate";
import { productCache } from "./cache";

const selectProduct = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  teamId: true,
  languages: true,
  recontactDays: true,
  linkSurveyBranding: true,
  inAppSurveyBranding: true,
  placement: true,
  clickOutsideClose: true,
  darkOverlay: true,
  environments: true,
  styling: true,
};

export const getProducts = async (_teamId: string, _page?: number): Promise<TProduct[]> => {
  // const products = await unstable_cache(
  //   async () => {
  //     validateInputs([teamId, ZId], [page, ZOptionalNumber]);

  //     try {
  //       const products = await prisma.product.findMany({
  //         where: {
  //           teamId,
  //         },
  //         select: selectProduct,
  //         take: page ? ITEMS_PER_PAGE : undefined,
  //         skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
  //       });
  //       return products;
  //     } catch (error) {
  //       if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //         throw new DatabaseError(error.message);
  //       }

  //       throw error;
  //     }
  //   },
  //   [`getProducts-${teamId}-${page}`],
  //   {
  //     tags: [productCache.tag.byTeamId(teamId)],
  //     revalidate: SERVICES_REVALIDATION_INTERVAL,
  //   }
  // )();
  const products = [(await getProductByEnvironmentId(""))!];
  return products.map((product) => formatDateFields(product, ZProduct));
};

export const getProductByEnvironmentId = async (_environmentId: string): Promise<TProduct | null> => {
  // const product = await unstable_cache(
  //   async () => {
  //     validateInputs([environmentId, ZId]);

  //     let productPrisma;

  //     try {
  //       productPrisma = await prisma.product.findFirst({
  //         where: {
  //           environments: {
  //             some: {
  //               id: environmentId,
  //             },
  //           },
  //         },
  //         select: selectProduct,
  //       });

  //       return productPrisma;
  //     } catch (error) {
  //       if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //         console.error(error);
  //         throw new DatabaseError(error.message);
  //       }
  //       throw error;
  //     }
  //   },
  //   [`getProductByEnvironmentId-${environmentId}`],
  //   {
  //     tags: [productCache.tag.byEnvironmentId(environmentId)],
  //     revalidate: SERVICES_REVALIDATION_INTERVAL,
  //   }
  // )();
  const environment: TEnvironment = {
    id: "clu9zkz3l000agecrg5nlvm2a",
    createdAt: new Date("2024-03-27T15:54:36.849Z"),
    updatedAt: new Date("2024-03-27T16:05:31.383Z"),
    type: "production",
    productId: "clu9zkz310003gecr3u8j5a90",
    widgetSetupCompleted: true,
  };
  const product: TProduct = {
    id: "clu9zkz310003gecr3u8j5a90",
    createdAt: new Date("2024-03-27T15:54:36.830Z"),
    updatedAt: new Date("2024-03-27T15:54:36.830Z"),
    name: "My Product",
    teamId: "clu9zkz2r0001gecrd757e94t",
    brandColor: null,
    highlightBorderColor: null,
    styling: { allowStyleOverwrite: true },
    recontactDays: 7,
    linkSurveyBranding: true,
    inAppSurveyBranding: true,
    placement: "bottomRight",
    clickOutsideClose: true,
    darkOverlay: false,
    environments: [environment],
    languages: [],
  };
  return product ? formatDateFields(product, ZProduct) : null;
};

export const updateProduct = async (
  productId: string,
  inputProduct: TProductUpdateInput
): Promise<TProduct> => {
  validateInputs([productId, ZId], [inputProduct, ZProductUpdateInput]);
  const { environments, ...data } = inputProduct;
  let updatedProduct;
  try {
    updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...data,
        environments: {
          connect: environments?.map((environment) => ({ id: environment.id })) ?? [],
        },
      },
      select: selectProduct,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
  }

  try {
    const product = ZProduct.parse(updatedProduct);

    productCache.revalidate({
      id: product.id,
      teamId: product.teamId,
    });

    product.environments.forEach((environment) => {
      // revalidate environment cache
      productCache.revalidate({
        environmentId: environment.id,
      });
    });

    return product;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(JSON.stringify(error.errors, null, 2));
    }
    throw new ValidationError("Data validation of product failed");
  }
};

export const getProduct = async (productId: string): Promise<TProduct | null> => {
  const product = await unstable_cache(
    async () => {
      let productPrisma;
      try {
        productPrisma = await prisma.product.findUnique({
          where: {
            id: productId,
          },
          select: selectProduct,
        });

        return productPrisma;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }
        throw error;
      }
    },
    [`getProduct-${productId}`],
    {
      tags: [productCache.tag.byId(productId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();
  return product ? formatDateFields(product, ZProduct) : null;
};

export const deleteProduct = async (productId: string): Promise<TProduct> => {
  const product = await prisma.product.delete({
    where: {
      id: productId,
    },
    select: selectProduct,
  });

  if (product) {
    // delete all files from storage related to this product

    if (isS3Configured()) {
      const s3FilesPromises = product.environments.map(async (environment) => {
        return deleteS3FilesByEnvironmentId(environment.id);
      });

      try {
        await Promise.all(s3FilesPromises);
      } catch (err) {
        // fail silently because we don't want to throw an error if the files are not deleted
        console.error(err);
      }
    } else {
      const localFilesPromises = product.environments.map(async (environment) => {
        return deleteLocalFilesByEnvironmentId(environment.id);
      });

      try {
        await Promise.all(localFilesPromises);
      } catch (err) {
        // fail silently because we don't want to throw an error if the files are not deleted
        console.error(err);
      }
    }

    productCache.revalidate({
      id: product.id,
      teamId: product.teamId,
    });

    environmentCache.revalidate({
      productId: product.id,
    });

    product.environments.forEach((environment) => {
      // revalidate product cache
      productCache.revalidate({
        environmentId: environment.id,
      });
      environmentCache.revalidate({
        id: environment.id,
      });
    });
  }

  return product;
};

export const createProduct = async (
  teamId: string,
  productInput: Partial<TProductUpdateInput>
): Promise<TProduct> => {
  validateInputs([teamId, ZString], [productInput, ZProductUpdateInput.partial()]);

  if (!productInput.name) {
    throw new ValidationError("Product Name is required");
  }

  const { environments, ...data } = productInput;

  let product = await prisma.product.create({
    data: {
      ...data,
      name: productInput.name,
      teamId,
    },
    select: selectProduct,
  });

  const devEnvironment = await createEnvironment(product.id, {
    type: "development",
  });

  const prodEnvironment = await createEnvironment(product.id, {
    type: "production",
  });

  return await updateProduct(product.id, {
    environments: [devEnvironment, prodEnvironment],
  });
};
