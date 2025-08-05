import { UserPermission } from '@prisma/client'
import { z } from 'zod'

import { ExpectedError } from '../../lib/error'
import { prisma } from '../../lib/prisma'
import { trpcLoggedProcedure } from '../../lib/trpc'
import { hasPermission } from '../../utils/can'

export const deleteStaticPageInputSchema = z.object({
  id: z.string(),
})

export const deleteStaticPageProcedure = trpcLoggedProcedure
  .input(deleteStaticPageInputSchema)
  .mutation(async ({ input, ctx }) => {
    if (!hasPermission(ctx.me, UserPermission.EDIT_STATIC_PAGES)) {
      throw new ExpectedError('NO_PERMISSION', 'You do not have permission to delete static pages.')
    }
    const { id } = input
    await prisma.staticPage.delete({
      where: { id },
    })
    return { success: true }
  })
