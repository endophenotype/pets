import { zStringOptional } from '@pets/shared/src/zod'
import { z } from 'zod'

export const zGetPetsTrpcInput = z.object({
  cursor: z.union([z.coerce.number(), z.coerce.date()]).optional(), // Изменено на union
  limit: z.number().min(1).max(1000).default(10),
  search: zStringOptional,
  status: z.enum(['pending', 'blocked', 'approved']).optional(),
  sort: z
    .object({
      serialNumber: z.enum(['asc', 'desc']).optional(),
      createdAt: z.enum(['asc', 'desc']).optional(),
    })
    .optional(),
})
