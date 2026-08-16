import { env } from './lib/env'

import { createBackendApp } from './app'
import { logger } from './lib/logger'

void (async () => {
  const backendApp = await createBackendApp()
  try {
    backendApp.expressApp.listen(env.PORT, () => {
      logger.info('express', `Listening at http://localhost:${env.PORT}`)
    })
  } catch (error) {
    logger.error('app', error)
    await backendApp.ctx.stop()
  }
})()
