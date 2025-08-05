import { createTrpcRouter } from '../../lib/trpc'

import { createStaticPageProcedure } from './createStaticPage'
import { deleteStaticPageProcedure } from './deleteStaticPage'
import { getStaticPageProcedure } from './getStaticPage'
import { getStaticPagesProcedure } from './getStaticPages'
import { updateStaticPageProcedure } from './updateStaticPage'

export const staticPagesRouter = createTrpcRouter({
  getStaticPage: getStaticPageProcedure,
  getStaticPages: getStaticPagesProcedure,
  createStaticPage: createStaticPageProcedure,
  updateStaticPage: updateStaticPageProcedure,
  deleteStaticPage: deleteStaticPageProcedure,
})
