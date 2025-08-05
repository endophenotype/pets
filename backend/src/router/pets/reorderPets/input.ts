import { z } from 'zod'

export const zReorderPetsInput = z.array(
  z.object({
    id: z.string(),
    serialNumber: z.number().int().min(1),
  })
)
