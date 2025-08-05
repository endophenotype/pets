import { zStringRequired } from '@pets/shared/src/zod'

import { zCreatePetTrpcInput } from '../createPet/input'

export const zUpdatePetTrpcInput = zCreatePetTrpcInput.extend({
  petId: zStringRequired,
})
