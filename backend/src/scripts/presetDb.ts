import { env } from '../lib/env'

import { type AppContext } from '../lib/ctx'
import { getPasswordHash } from '../utils/getPasswordHash'

export const presetDb = async (ctx: AppContext) => {
  const adminPassword = getPasswordHash(env.INITIAL_ADMIN_PASSWORD)

  await ctx.prisma.user.upsert({
    where: {
      nick: 'admin',
    },
    create: {
      nick: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      permissions: ['ALL'],
    },
    update: {
      password: adminPassword,
      permissions: ['ALL'],
    },
  })
}
