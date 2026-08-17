import { env } from '../lib/env'

import { createAppContext } from '../lib/ctx'
import { getPasswordHash } from '../utils/getPasswordHash'

const adminNick = 'admin'

void (async () => {
  const ctx = createAppContext()

  try {
    const admin = await ctx.prisma.user.findUnique({
      where: {
        nick: adminNick,
      },
      select: {
        id: true,
        password: true,
      },
    })

    if (!admin) {
      throw new Error(`User "${adminNick}" was not found`)
    }

    const password = getPasswordHash(env.INITIAL_ADMIN_PASSWORD)

    if (admin.password === password) {
      console.info(`Password for "${adminNick}" already matches INITIAL_ADMIN_PASSWORD`)
      return
    }

    await ctx.prisma.user.update({
      where: {
        nick: adminNick,
      },
      data: {
        password,
      },
    })

    console.info(`Password for "${adminNick}" has been reset`)
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  } finally {
    await ctx.stop()
  }
})()
