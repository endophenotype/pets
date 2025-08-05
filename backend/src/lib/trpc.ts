import { type inferAsyncReturnType, initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { type Express } from 'express'
import superjson from 'superjson'

import { type TrpcRouter } from '../router'
import { type ExpressRequest } from '../utils/types'

import { type AppContext } from './ctx'
import { ExpectedError } from './error'
import { logger } from './logger'

const getCreateTrpcContext =
  (appContext: AppContext) =>
  ({ req }: trpcExpress.CreateExpressContextOptions) => ({
    ...appContext,
    me: (req as ExpressRequest).user || null,
  })

type TrpcContext = inferAsyncReturnType<ReturnType<typeof getCreateTrpcContext>> & { user?: TrpcContext['me'] }

const trpc = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    const isExpected = error.cause instanceof ExpectedError
    return {
      ...shape,
      data: {
        ...shape.data,
        isExpected,
      },
    }
  },
})

export const createTrpcRouter = trpc.router
export const publicProcedure = trpc.procedure
export const adminProcedure = trpc.procedure.use(
  trpc.middleware(async ({ ctx, next }) => {
    if (!ctx.me || !ctx.me.permissions.includes('ALL')) {
      throw new ExpectedError('NO_PERMISSION', 'Доступ разрешён только администраторам')
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.me,
      },
    })
  })
)

export const trpcLoggedProcedure = trpc.procedure.use(
  trpc.middleware(async ({ path, type, next, ctx, rawInput }) => {
    const start = Date.now()
    const result = await next()
    const durationMs = Date.now() - start
    const meta = {
      path,
      type,
      userId: ctx.me?.id || null,
      durationMs,
      rawInput: rawInput || null,
    }
    if (result.ok) {
      logger.info(`trpc:${type}:success`, 'Successfull request', { ...meta, output: result.data })
    } else {
      logger.error(`trpc:${type}:error`, result.error, meta)
    }
    return result
  })
)

export const applyTrpcToExpressApp = async (expressApp: Express, appContext: AppContext, trpcRouter: TrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: getCreateTrpcContext(appContext),
    })
  )

  if (process.env.NODE_ENV !== 'production') {
    const { expressHandler } = await import('trpc-playground/handlers/express')
    expressApp.use(
      '/trpc-playground',
      await expressHandler({
        trpcApiEndpoint: '/trpc',
        playgroundEndpoint: '/trpc-playground',
        router: trpcRouter,
        request: {
          superjson: true,
        },
      })
    )
  }
}
