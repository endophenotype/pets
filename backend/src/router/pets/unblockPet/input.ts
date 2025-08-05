import { z } from 'zod'

export const zUnblockPetTrpcInput = z.object({
  petId: z.string().uuid(),
})
