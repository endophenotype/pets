import { z } from 'zod'

import { ExpectedError } from '../../lib/error'
import { prisma } from '../../lib/prisma'
import { trpcLoggedProcedure } from '../../lib/trpc'

export const getStaticPageInputSchema = z.object({
  slug: z.string(),
})

export const getStaticPageProcedure = trpcLoggedProcedure.input(getStaticPageInputSchema).query(async ({ input }) => {
  const { slug } = input
  const staticPage = await (prisma.staticPage as any).findUnique({
    where: { slug },
  })

  if (!staticPage) {
    throw new ExpectedError('STATIC_PAGE_NOT_FOUND', 'Static page not found')
  }

  return staticPage
})
