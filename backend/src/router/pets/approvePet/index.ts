import { adminProcedure } from '../../../lib/trpc'

import { zApprovePetTrpcInput } from './input'

export const approvePetTrpcRoute = adminProcedure.input(zApprovePetTrpcInput).mutation(async ({ ctx, input }) => {
  const { petId } = input
  const pet = await ctx.prisma.pet.findUnique({
    where: { id: petId },
  })
  if (!pet) {
    throw new Error('NOT_FOUND')
  }
  if (pet.approvedAt) {
    throw new Error('ALREADY_APPROVED')
  }
  await ctx.prisma.pet.update({
    where: { id: petId },
    data: { approvedAt: new Date() },
  })
  return true
})
