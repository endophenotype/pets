import type { Prisma } from '@prisma/client'

import { trpcLoggedProcedure } from '../../../lib/trpc'

import { zGetPetsTrpcInput } from './input'

export const getPetsTrpcRoute = trpcLoggedProcedure.input(zGetPetsTrpcInput).query(async ({ ctx, input }) => {
  // const normalizedSearch = input.search ? input.search.trim().replace(/[\s\n\t]/g, '_') : undefined
  const normalizedSearch = input.search ? input.search.trim().replace(/[\s\n\t]/g, ' & ') : undefined
  const isAdmin =
    ctx.me &&
    (ctx.me.permissions.includes('APPROVE_PERSON') ||
      ctx.me.permissions.includes('BLOCK_PERSONS') ||
      ctx.me.permissions.includes('ALL'))

  const orderBy: Prisma.PetOrderByWithRelationInput[] = []
  if (input.sort?.serialNumber) {
    orderBy.push({ serialNumber: input.sort.serialNumber })
  }
  if (input.sort?.createdAt) {
    orderBy.push({ createdAt: input.sort.createdAt })
  }
  if (orderBy.length === 0) {
    orderBy.push({ createdAt: 'desc' }) // Сортировка по умолчанию
  }

  const pets = await ctx.prisma.pet.findMany({
    select: {
      id: true,
      nick: true,
      name: true,
      serialNumber: true,
      approvedAt: true,
      blockedAt: true,
      images: true,
      createdAt: true, // Добавляем createdAt в select для использования в nextCursor
    },
    where: {
      ...(isAdmin
        ? input.status === 'pending'
          ? { approvedAt: null, blockedAt: null }
          : input.status === 'blocked'
            ? { blockedAt: { not: null } }
            : input.status === 'approved'
              ? { approvedAt: { not: null }, blockedAt: null }
              : {}
        : {
            blockedAt: null,
            approvedAt: { not: null },
          }),
      ...(!normalizedSearch
        ? {}
        : {
            OR: [
              {
                name: {
                  search: normalizedSearch,
                },
              },
              {
                text: {
                  search: normalizedSearch,
                },
              },
            ],
          }),
    },
    orderBy,
    cursor: input.cursor ? { serialNumber: input.cursor as number } : undefined, // Всегда используем serialNumber для курсора
    take: input.limit + 1,
  })
  const nextPet = pets.at(input.limit)
  const nextCursor = nextPet?.serialNumber // Всегда используем serialNumber для nextCursor
  const petsExceptNext = pets.slice(0, input.limit)

  return { pets: petsExceptNext, nextCursor }
})
