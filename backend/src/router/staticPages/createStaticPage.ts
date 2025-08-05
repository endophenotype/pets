import { marked } from 'marked'
import { z } from 'zod'

import { prisma } from '../../lib/prisma'
import { adminProcedure } from '../../lib/trpc'

export const createStaticPageInputSchema = z.object({
  slug: z.string(),
  title: z.string(),
  content: z.string(),
})

export const createStaticPageProcedure = adminProcedure
  .input(createStaticPageInputSchema)
  .mutation(async ({ input }) => {
    const { slug, title, content } = input
    const htmlContent = await marked(content)
    const staticPage = await prisma.staticPage.create({
      data: {
        slug,
        title,
        content: htmlContent,
      },
    })
    return staticPage
  })
