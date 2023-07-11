import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export const venueRouter = router({
  getVenueCategories: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const totalCount = await ctx.prisma.categories.count();
      const randomIndex = Math.floor(Math.random() * totalCount);
      return ctx.prisma.categories.findMany({
        take: input,
        skip: randomIndex,
      });
    }),
  getVenue: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const venue = await ctx.prisma.venues.findFirst({
      include: {
        cities: true,
        categories: true,
        features: {
          include: {
            featurename: true,
          },
        },
      },
      where: {
        name: input,
      },
    });

    return venue;
  }),
  getVenues: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const totalCount = await ctx.prisma.venues.count();
    const randomIndex = Math.floor(Math.random() * totalCount);
    return ctx.prisma.venues.findMany({
      take: input,
      skip: randomIndex,
      include: {
        categories: true,
        cities: true,
      },
    });
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return 'you can see this secret message!';
  }),
});
