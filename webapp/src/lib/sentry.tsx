import * as Sentry from '@sentry/react'
import { useEffect } from 'react'

import { useMe } from './ctx'
import { env } from './env'
if (env.VITE_WEBAPP_SENTRY_DSN) {
  Sentry.init({
    dsn: env.VITE_WEBAPP_SENTRY_DSN,
    environment: env.HOST_ENV,
    normalizeDepth: 10,
  })
}
export const sentryCaptureException = async (error: Error) => {
  if (env.VITE_WEBAPP_SENTRY_DSN) {
    Sentry.captureException(error)
  }
  // Отправляем ошибку через наш TRPC-эндпоинт
  try {
    await fetch('/api/trpc/sentryProxy.captureException', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        name: error.name,
        extra: {
          // Дополнительные данные, если есть
        },
      }),
    })
  } catch (fetchError) {
    console.error('Failed to send error to Sentry proxy:', fetchError)
  }
}

export const SentryUser = () => {
  const me = useMe()
  useEffect(() => {
    if (env.VITE_WEBAPP_SENTRY_DSN) {
      if (me) {
        Sentry.setUser({
          email: me.email,
          id: me.id,
          ip_address: '{{auto}}',
          username: me.nick,
        })
      } else {
        Sentry.setUser(null)
      }
    }
  }, [me])
  return null
}
