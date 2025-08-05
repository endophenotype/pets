import { z } from 'zod'

export const zApprovePetTrpcInput = z.object({
  petId: z.string().uuid(),
})
