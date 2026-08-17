import { env } from '../lib/env'

import crypto from 'crypto'

export const getPasswordHash = (password: string, salt = env.PASSWORD_SALT) => {
  return crypto.createHash('sha256').update(`${salt}${password}`).digest('hex')
}

export const getPreviousPasswordHash = (password: string) => {
  if (!env.PASSWORD_SALT_PREVIOUS) {
    return null
  }

  return getPasswordHash(password, env.PASSWORD_SALT_PREVIOUS)
}
