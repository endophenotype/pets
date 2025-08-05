import { zStringRequired } from '@pets/shared/src/zod'
import { z } from 'zod'

export const zGetPetTrpcInput = z.object({
  nick: zStringRequired,
})
