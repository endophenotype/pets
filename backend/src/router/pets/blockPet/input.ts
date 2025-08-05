import { zStringRequired } from '@pets/shared/src/zod'
import { z } from 'zod'

export const zBlockPetTrpcInput = z.object({
  petId: zStringRequired,
})
