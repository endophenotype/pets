import fs from 'fs'
import path from 'path'

import { zEnvHost, zEnvNonemptyTrimmed, zEnvNonemptyTrimmedRequiredOnNotLocal } from '@pets/shared/src/zod'
import * as dotenv from 'dotenv'
import { z } from 'zod'

const findEnvFilePath = (dir: string, pathPart: string): string | null => {
  const maybeEnvFilePath = path.join(dir, pathPart)
  if (fs.existsSync(maybeEnvFilePath)) {
    return maybeEnvFilePath
  }
  if (dir === '/') {
    return null
  }
  return findEnvFilePath(path.dirname(dir), pathPart)
}
const webappEnvFilePath = findEnvFilePath(__dirname, 'webapp/.env')
const initialEnvKeys = new Set(Object.keys(process.env))
const applyEnvFile = (envFilePath: string) => {
  const parsedEnv = dotenv.config({ path: envFilePath }).parsed
  if (!parsedEnv) {
    return
  }
  for (const [key, value] of Object.entries(parsedEnv)) {
    if (!initialEnvKeys.has(key)) {
      process.env[key] = value
    }
  }
}

if (webappEnvFilePath) {
  applyEnvFile(webappEnvFilePath)
  applyEnvFile(`${webappEnvFilePath}.${process.env.NODE_ENV}`)
}
const backendEnvFilePath = findEnvFilePath(__dirname, 'backend/.env')
if (backendEnvFilePath) {
  applyEnvFile(backendEnvFilePath)
  applyEnvFile(`${backendEnvFilePath}.${process.env.NODE_ENV}`)
}

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
process.env.HOST_ENV ||= process.env.VERCEL ? 'production' : undefined
process.env.SOURCE_VERSION ||= process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
process.env.WEBAPP_URL ||= vercelUrl ? `https://${vercelUrl}` : undefined

for (const [key, value] of Object.entries(process.env)) {
  if (typeof value === 'string') {
    process.env[key] = value.trim()
  }
}

const zEnv = z.object({
  NODE_ENV: z.enum(['test', 'development', 'production']),
  PORT: zEnvNonemptyTrimmed.default('3000'),
  HOST_ENV: zEnvHost,
  DATABASE_URL: zEnvNonemptyTrimmed.refine((val) => {
    if (process.env.NODE_ENV !== 'test') {
      return true
    }
    const [databaseUrl] = val.split('?')
    const [databaseName] = databaseUrl.split('/').reverse()
    return databaseName.endsWith('-test')
  }, `Data base name should ends with "-test" on test environment`),
  JWT_SECRET: zEnvNonemptyTrimmed,
  PASSWORD_SALT: zEnvNonemptyTrimmed,
  PASSWORD_SALT_PREVIOUS: zEnvNonemptyTrimmed.optional(),
  INITIAL_ADMIN_PASSWORD: zEnvNonemptyTrimmed,
  WEBAPP_URL: zEnvNonemptyTrimmed,
  DEBUG: z
    .string()
    .optional()
    .refine(
      (val) => process.env.HOST_ENV === 'local' || process.env.NODE_ENV !== 'production' || (!!val && val.length > 0),
      'Required on not local host on production'
    ),
  BACKEND_SENTRY_DSN: zEnvNonemptyTrimmed.optional(),
  SOURCE_VERSION: zEnvNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_API_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_API_SECRET: zEnvNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
})

export const env = zEnv.parse(process.env)
