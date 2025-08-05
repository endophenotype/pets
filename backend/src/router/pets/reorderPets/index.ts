import { adminProcedure } from '../../../lib/trpc'

import { zReorderPetsInput } from './input'

export const reorderPetsTrpcRoute = adminProcedure.input(zReorderPetsInput).mutation(async ({ input, ctx }) => {
  // Собираем все ID и новые serialNumber из входных данных
  const updates = new Map(input.map((item) => [item.id, item.serialNumber]))
  const petIds = Array.from(updates.keys())

  await ctx.prisma.$transaction(async (prisma) => {
    // Шаг 1: Временно устанавливаем serialNumber для всех затрагиваемых Pet на уникальные отрицательные значения
    // Это освобождает текущие serialNumber, предотвращая конфликты уникальности
    await Promise.all(
      petIds.map((id, index) =>
        prisma.pet.update({
          where: { id },
          data: { serialNumber: -(index + 1) }, // Используем отрицательные числа как временные уникальные значения
        })
      )
    )

    // Шаг 2: Обновляем serialNumber на их окончательные значения
    // Теперь, когда все старые serialNumber освобождены, мы можем безопасно присвоить новые
    for (const { id, serialNumber } of input) {
      await prisma.pet.update({
        where: { id },
        data: { serialNumber },
      })
    }
  })

  return { success: true }
})
