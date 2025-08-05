import { trpcLoggedProcedure } from '../../../lib/trpc'
import { canUnblockPet } from '../../../utils/can'

import { zUnblockPetTrpcInput } from './input'

export const unblockPetTrpcRoute = trpcLoggedProcedure.input(zUnblockPetTrpcInput).mutation(async ({ ctx, input }) => {
  const { petId } = input
  if (!canUnblockPet(ctx.me)) {
    throw new Error('PERMISSION_DENIED')
  }
  const pet = await ctx.prisma.pet.findUnique({
    where: { id: petId },
  })
  if (!pet) {
    throw new Error('NOT_FOUND')
  }
  if (!pet.blockedAt) {
    throw new Error('NOT_BLOCKED')
  }
  await ctx.prisma.pet.update({
    where: { id: petId },
    data: { blockedAt: null, approvedAt: null },
  })
  return true
})
