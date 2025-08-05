import 'dotenv/config'
import { env } from './env'

import { EOL } from 'os'

import { omit } from '@pets/shared/src/omit'
import { TRPCError } from '@trpc/server'
import debug from 'debug'
import _ from 'lodash'
import micromatch from 'micromatch'
import pc from 'picocolors'
import { serializeError } from 'serialize-error'
import { MESSAGE } from 'triple-beam'
import winston from 'winston'
import * as yaml from 'yaml'

import { deepMap } from '../utils/deepMap'

import { ExpectedError } from './error'
import { sentryCaptureException } from './sentry'
export const winstonLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'backend', hostEnv: env.HOST_ENV },
  transports: [
    new winston.transports.Console({
      format:
        env.HOST_ENV !== 'local'
          ? winston.format.json()
          : winston.format((logData) => {
              const setColor = {
                info: (str: string) => pc.blue(str),
                error: (str: string) => pc.red(str),
                debug: (str: string) => pc.cyan(str),
              }[logData.level as 'info' | 'error' | 'debug']
              const levelAndType = `${logData.level} ${logData.logType}`
              const topMessage = `${setColor(levelAndType)} ${pc.green(logData.timestamp as string)}${EOL}${logData.message}`
              const visibleMessageTags = omit(logData, [
                'level',
                'logType',
                'timestamp',
                'message',
                'service',
                'hostEnv',
              ])

              const stringifyedLogData = _.trim(
                yaml.stringify(visibleMessageTags, (_k, v) => (_.isFunction(v) ? 'Function' : v))
              )

              const resultLogData = {
                ...logData,
                [MESSAGE]:
                  [topMessage, Object.keys(visibleMessageTags).length > 0 ? `${EOL}${stringifyedLogData}` : '']
                    .filter(Boolean)
                    .join('') + EOL,
              }

              return resultLogData
            })(),
    }),
  ],
})

export type LoggerMetaData = Record<string, any> | undefined
const prettifyMeta = (meta: LoggerMetaData): LoggerMetaData => {
  return deepMap(meta, ({ key, value }) => {
    if (
      [
        'email',
        'password',
        'passwordAgain',
        'newPassword',
        'oldPassword',
        'token',
        'text',
        'apiKey',
        'signature',
      ].includes(key)
    ) {
      return '🙈'
    }
    return value
  })
}

export const logger = {
  info: (logType: string, message: string, meta?: LoggerMetaData) => {
    const ns = `pets:${logType}`
    const debugNamespaces = (env.DEBUG || '').split(',').map((ns) => ns.trim())

    let shouldLog: boolean | undefined

    for (const pattern of debugNamespaces) {
      const isNegative = pattern.startsWith('-')
      const cleanPattern = isNegative ? pattern.slice(1) : pattern
      const isMatch = micromatch.isMatch(ns, cleanPattern)
      if (isMatch) {
        shouldLog = !isNegative
      }
    }

    if (!shouldLog) {
      return
    }

    winstonLogger.info(message, { logType, ...prettifyMeta(meta) })
  },

  error: (logType: string, error: any, meta?: LoggerMetaData) => {
    const isNativeExpectedError = error instanceof ExpectedError
    const isTrpcExpectedError = error instanceof TRPCError && error.cause instanceof ExpectedError
    const prettifiedMetaData = prettifyMeta(meta)
    if (!isNativeExpectedError && !isTrpcExpectedError) {
      sentryCaptureException(error, prettifiedMetaData)
    }
    if (!debug.enabled(`pets:${logType}`)) {
      return
    }
    const serializedError = serializeError(error)
    winstonLogger.error(serializedError.message || 'Unknown error', {
      logType,
      error,
      errorStack: serializedError.stack,
      ...prettifyMeta(meta),
    })
  },
}
