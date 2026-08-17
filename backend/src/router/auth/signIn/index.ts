import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { getPasswordHash, getPreviousPasswordHash } from '../../../utils/getPasswordHash'
import { signJWT } from '../../../utils/signJWT'

import { zSignInTrpcInput } from './input'

export const signInTrpcRoute = trpcLoggedProcedure.input(zSignInTrpcInput).mutation(async ({ ctx, input }) => {
  const currentPassword = getPasswordHash(input.password)
  const user = await ctx.prisma.user.findFirst({
    where: {
      nick: input.nick,
      password: currentPassword,
    },
  })
  if (user) {
    const token = signJWT(user.id)
    return { token, userId: user.id }
  }

  const previousPassword = getPreviousPasswordHash(input.password)
  const userWithPreviousPassword = previousPassword
    ? await ctx.prisma.user.findFirst({
        where: {
          nick: input.nick,
          password: previousPassword,
        },
      })
    : null

  if (!userWithPreviousPassword) {
    throw new ExpectedError('WRONG_NICK_OR_PASSWORD', 'Wrong nick or password')
  }

  await ctx.prisma.user.update({
    where: {
      id: userWithPreviousPassword.id,
    },
    data: {
      password: currentPassword,
    },
  })

  const token = signJWT(userWithPreviousPassword.id)
  return { token, userId: userWithPreviousPassword.id }
})
