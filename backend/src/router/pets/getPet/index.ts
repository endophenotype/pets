import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'

import { zGetPetTrpcInput } from './input'

export const getPetTrpcRoute = trpcLoggedProcedure.input(zGetPetTrpcInput).query(async ({ ctx, input }) => {
  const rawPet = await ctx.prisma.pet.findUnique({
    where: {
      nick: input.nick,
    },
    include: {
      author: {
        select: {
          id: true,
          nick: true,
          name: true,
          avatar: true,
        },
      },
    },
  })
  const isAdmin = ctx.me && (ctx.me.permissions.includes('BLOCK_PETS') || ctx.me.permissions.includes('ALL'))
  if (rawPet?.blockedAt && !isAdmin) {
    throw new ExpectedError('PET_BLOCKED', 'Pet is blocked by administrator')
  }
  if (rawPet?.approvedAt === null && !isAdmin) {
    throw new ExpectedError('NOT_FOUND', 'Pet not found')
  }
  const pet = rawPet
  return { pet }
})
