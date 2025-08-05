import { pick } from '@pets/shared/src/pick'
import { type User } from '@prisma/client'
import _ from 'lodash'

export const toClientMe = (user: User | null) => {
  return user && pick(user, ['id', 'nick', 'name', 'permissions', 'email', 'avatar'])
}
