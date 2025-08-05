import { zNickRequired, zStringRequired } from '@pets/shared/src/zod'
import { z } from 'zod'

export const zCreatePetTrpcInput = z.object({
  name: zStringRequired,
  nick: zNickRequired,
  text: zStringRequired,
  images: z.array(zStringRequired),
  price: zStringRequired,
  groupLink: z.string().optional(),
  contactLink: zStringRequired,
})
