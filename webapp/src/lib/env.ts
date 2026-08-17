import { zEnvHost, zEnvNonemptyTrimmed, zEnvNonemptyTrimmedRequiredOnNotLocal } from '@pets/shared/src/zod'
import { z } from 'zod'

export const zEnv = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  HOST_ENV: zEnvHost,
  SOURCE_VERSION: zEnvNonemptyTrimmedRequiredOnNotLocal,
  VITE_BACKEND_TRPC_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_SENTRY_DSN: zEnvNonemptyTrimmed.optional(),
  VITE_CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
  VITE_MIXPANEL_API_KEY: zEnvNonemptyTrimmed.optional(),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const envFromBackend = (window as any).webappEnvFromBackend

// eslint-disable-next-line no-restricted-syntax
const viteEnv = import.meta.env
const browserEnv = {
  NODE_ENV: viteEnv.MODE === 'production' ? 'production' : 'development',
  HOST_ENV: viteEnv.VITE_HOST_ENV || (viteEnv.PROD ? 'production' : 'local'),
  SOURCE_VERSION: viteEnv.VITE_SOURCE_VERSION || 'unknown',
  VITE_BACKEND_TRPC_URL: viteEnv.VITE_BACKEND_TRPC_URL || '/trpc',
  VITE_WEBAPP_URL: viteEnv.VITE_WEBAPP_URL || window.location.origin,
  VITE_WEBAPP_SENTRY_DSN: viteEnv.VITE_WEBAPP_SENTRY_DSN || undefined,
  VITE_CLOUDINARY_CLOUD_NAME: viteEnv.VITE_CLOUDINARY_CLOUD_NAME || 'db8wupgxo',
  VITE_MIXPANEL_API_KEY: viteEnv.VITE_MIXPANEL_API_KEY || undefined,
}

export const env = zEnv.parse(
  envFromBackend?.replaceMeWithPublicEnv ? browserEnv : { ...browserEnv, ...envFromBackend }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).webappEnvFromBackend = env
