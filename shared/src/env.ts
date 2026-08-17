/* eslint-disable n/no-process-env */
import { z } from 'zod'

import { zEnvNonemptyTrimmed } from './zod'
declare global {
  const webappEnvFromBackend: Record<string, string> | undefined
}
const windowEnv = typeof webappEnvFromBackend !== 'undefined' ? webappEnvFromBackend : {}

const processEnv = typeof process !== 'undefined' ? process.env : {}
const getSharedEnvVariable = (key: string) =>
  windowEnv[`VITE_${key}`] ||
  windowEnv[key] ||
  processEnv[`VITE_${key}`] ||
  processEnv[key] ||
  (key === 'WEBAPP_URL' && typeof window !== 'undefined' ? window.location.origin : undefined) ||
  (key === 'CLOUDINARY_CLOUD_NAME' ? 'db8wupgxo' : undefined)

const sharedEnvRaw = {
  CLOUDINARY_CLOUD_NAME: getSharedEnvVariable('CLOUDINARY_CLOUD_NAME'),
  WEBAPP_URL: getSharedEnvVariable('WEBAPP_URL'),
}

const zEnv = z.object({
  WEBAPP_URL: zEnvNonemptyTrimmed,
  CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
})

export const sharedEnv = zEnv.parse(sharedEnvRaw)
