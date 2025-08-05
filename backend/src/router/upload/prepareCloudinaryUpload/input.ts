import { cloudinaryUploadTypes } from '@pets/shared/src/cloudinary'
import { getKeysAsArray } from '@pets/shared/src/getKeysAsArray'
import { z } from 'zod'

export const zPrepareCloudinaryUploadTrpcInput = z.object({
  type: z.enum(getKeysAsArray(cloudinaryUploadTypes)),
})
