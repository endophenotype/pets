import { z } from 'zod'

import { sentryCaptureException } from '../../lib/sentry'
import { createTrpcRouter, publicProcedure } from '../../lib/trpc'

const sentryProxyInput = z.object({
  message: z.string(),
  stack: z.string().optional(),
  name: z.string().optional(),
  // Дополнительные данные, которые могут быть полезны для Sentry
  extra: z.record(z.any()).optional(),
})

export const sentryProxyRouter = createTrpcRouter({
  captureException: publicProcedure
    .input(sentryProxyInput)
    .mutation(async ({ input }: { input: z.infer<typeof sentryProxyInput> }) => {
      const error = new Error(input.message)
      error.stack = input.stack
      if (input.name) {
        error.name = input.name
      }
      sentryCaptureException(error, input.extra)
      return { success: true }
    }),
})
