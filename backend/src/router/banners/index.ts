import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { prisma } from '../../lib/prisma'
import { createTrpcRouter, publicProcedure, adminProcedure } from '../../lib/trpc'
import { canManageBanners } from '../../utils/can'

export const bannersRouter = createTrpcRouter({
  createBanner: adminProcedure
    .input(
      z.object({
        image: z.string(),
        text: z.string(),
        link: z.string(),
        position: z.enum(['LEFT', 'RIGHT']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!canManageBanners(ctx.user)) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return prisma.banner.create({ data: input })
    }),

  updateBanner: adminProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
        text: z.string(),
        link: z.string(),
        position: z.enum(['LEFT', 'RIGHT']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!canManageBanners(ctx.user)) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      const { id, ...data } = input
      return prisma.banner.update({ where: { id }, data })
    }),

  getBanners: publicProcedure.query(async () => {
    return prisma.banner.findMany()
  }),

  deleteBanner: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!canManageBanners(ctx.user)) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return prisma.banner.delete({ where: { id: input.id } })
    }),
})
