import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { canEditPet } from '../../../utils/can'

import { zUpdatePetTrpcInput } from './input'

export const updatePetTrpcRoute = trpcLoggedProcedure.input(zUpdatePetTrpcInput).mutation(async ({ ctx, input }) => {
  const { petId, ...petInput } = input
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED')
  }
  const pet = await ctx.prisma.pet.findUnique({
    where: {
      id: petId,
    },
  })
  if (!pet) {
    throw new Error('NOT_FOUND')
  }
  if (!canEditPet(ctx.me, pet)) {
    throw new Error('NOT_YOUR_PERSON')
  }
  if (pet.nick !== input.nick) {
    const exPet = await ctx.prisma.pet.findUnique({
      where: {
        nick: input.nick,
      },
    })
    if (exPet) {
      throw new ExpectedError('PERSON_ALREADY_EXISTS', 'Pet with this nick already exists')
    }
  }
  await ctx.prisma.pet.update({
    where: {
      id: petId,
    },
    data: {
      ...petInput,
    },
  })
  return true
})
