import { sendPetBlockedEmail } from '../../../lib/emails'
import { adminProcedure } from '../../../lib/trpc'

import { zBlockPetTrpcInput } from './input'

export const blockPetTrpcRoute = adminProcedure.input(zBlockPetTrpcInput).mutation(async ({ ctx, input }) => {
  const { petId } = input
  const pet = await ctx.prisma.pet.findUnique({
    where: {
      id: petId,
    },
    include: {
      author: true,
    },
  })
  if (!pet) {
    throw new Error('NOT_FOUND')
  }
  await ctx.prisma.pet.update({
    where: {
      id: petId,
    },
    data: {
      blockedAt: new Date(),
    },
  })
  void sendPetBlockedEmail({ user: pet.author, pet })
  return true
})
