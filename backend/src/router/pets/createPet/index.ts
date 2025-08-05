import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'

import { zCreatePetTrpcInput } from './input'

export const createPetTrpcRoute = trpcLoggedProcedure.input(zCreatePetTrpcInput).mutation(async ({ input, ctx }) => {
  if (!ctx.me) {
    throw Error('Not authenticated')
  }
  const exPet = await ctx.prisma.pet.findUnique({
    where: {
      nick: input.nick,
    },
  })
  if (exPet) {
    throw new ExpectedError('PET_ALREADY_EXISTS', 'Pet with this nick already exists')
  }
  const maxSerialNumberPet = await ctx.prisma.pet.findFirst({
    orderBy: {
      serialNumber: 'desc',
    },
    take: 1,
  })

  const serialNumber = maxSerialNumberPet ? maxSerialNumberPet.serialNumber + 1 : 1

  const pet = await ctx.prisma.pet.create({
    data: { ...input, authorId: ctx.me.id, serialNumber },
  })
  return { pet }
})
