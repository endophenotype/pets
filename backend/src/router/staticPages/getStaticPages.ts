import { UserPermission } from '@prisma/client'

import { ExpectedError } from '../../lib/error'
import { prisma } from '../../lib/prisma'
import { trpcLoggedProcedure } from '../../lib/trpc'
import { hasPermission } from '../../utils/can'

export const getStaticPagesProcedure = trpcLoggedProcedure.query(async ({ ctx }) => {
  if (!hasPermission(ctx.me, UserPermission.EDIT_STATIC_PAGES)) {
    throw new ExpectedError('NO_PERMISSION', 'You do not have permission to view static pages.')
  }
  const staticPages = await prisma.staticPage.findMany()
  return staticPages
})
