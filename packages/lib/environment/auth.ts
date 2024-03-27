export const hasUserEnvironmentAccess = async (_userId: string, _environmentId: string) => {
  // return await unstable_cache(
  //   async (): Promise<boolean> => {
  //     validateInputs([userId, ZId], [environmentId, ZId]);

  //     const environment = await prisma.environment.findUnique({
  //       where: {
  //         id: environmentId,
  //       },
  //       select: {
  //         product: {
  //           select: {
  //             team: {
  //               select: {
  //                 memberships: {
  //                   select: {
  //                     userId: true,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });

  //     const environmentUsers = environment?.product.team.memberships.map((member) => member.userId) || [];
  //     return environmentUsers.includes(userId);
  //   },
  //   [`hasUserEnvironmentAccess-${userId}-${environmentId}`],
  //   {
  //     revalidate: SERVICES_REVALIDATION_INTERVAL,
  //     tags: [teamCache.tag.byEnvironmentId(environmentId), teamCache.tag.byUserId(userId)],
  //   }
  // )();
  return true;
};
