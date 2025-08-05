import { marked } from 'marked'
import { z } from 'zod'

import { prisma } from '../../lib/prisma'
import { adminProcedure } from '../../lib/trpc'

export const updateStaticPageInputSchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
})

export const updateStaticPageProcedure = adminProcedure
  .input(updateStaticPageInputSchema)
  .mutation(async ({ input }) => {
    const { id, content, ...rest } = input
    const htmlContent = content ? await marked(content) : undefined
    const staticPage = await prisma.staticPage.update({
      where: { id },
      data: {
        ...rest,
        content: htmlContent,
      },
    })
    return staticPage
  })
