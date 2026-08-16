import cors from 'cors'
import express from 'express'

import { type AppContext, createAppContext } from './lib/ctx'
import { logger } from './lib/logger'
import { applyPassportToExpressApp } from './lib/passport'
import { initSentry } from './lib/sentry'
import { applyServeWebApp } from './lib/serveWebApp'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'
import { presetDb } from './scripts/presetDb'

export const createBackendApp = async ({ serveWebApp = true } = {}) => {
  initSentry()
  const ctx = createAppContext()
  await presetDb(ctx)

  const expressApp = express()
  expressApp.use(cors())
  applyPassportToExpressApp(expressApp, ctx)
  await applyTrpcToExpressApp(expressApp, ctx, trpcRouter)
  if (serveWebApp) {
    await applyServeWebApp(expressApp)
  }
  expressApp.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('express', error)
    if (res.headersSent) {
      next(error)
      return
    }
    res.status(500).send('Internal server error')
  })

  return { expressApp, ctx }
}

export type BackendApp = Awaited<ReturnType<typeof createBackendApp>>
