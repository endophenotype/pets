import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'

import { createTrpcRouter } from '../lib/trpc'

// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getMeTrpcRoute } from './auth/getMe'
import { signInTrpcRoute } from './auth/signIn'
import { signUpTrpcRoute } from './auth/signUp'
import { updatePasswordTrpcRoute } from './auth/updatePassword'
import { updateProfileTrpcRoute } from './auth/updateProfile'
import { bannersRouter } from './banners'
import { approvePetTrpcRoute } from './pets/approvePet'
import { blockPetTrpcRoute } from './pets/blockPet'
import { createPetTrpcRoute } from './pets/createPet'
import { getPetTrpcRoute } from './pets/getPet'
import { getPetsTrpcRoute } from './pets/getPets'
import { reorderPetsTrpcRoute } from './pets/reorderPets'
import { unblockPetTrpcRoute } from './pets/unblockPet'
import { updatePetTrpcRoute } from './pets/updatePet'
import { sentryProxyRouter } from './sentryProxy'
import { staticPagesRouter } from './staticPages'
import { prepareCloudinaryUploadTrpcRoute } from './upload/prepareCloudinaryUpload'
// @endindex

export const trpcRouter = createTrpcRouter({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  getMe: getMeTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  updatePassword: updatePasswordTrpcRoute,
  updateProfile: updateProfileTrpcRoute,
  approvePet: approvePetTrpcRoute,
  blockPet: blockPetTrpcRoute,
  createPet: createPetTrpcRoute,
  getPet: getPetTrpcRoute,
  getPets: getPetsTrpcRoute,
  unblockPet: unblockPetTrpcRoute,
  updatePet: updatePetTrpcRoute,
  prepareCloudinaryUpload: prepareCloudinaryUploadTrpcRoute,
  staticPages: staticPagesRouter,
  reorderPets: reorderPetsTrpcRoute,
  banners: bannersRouter,
  sentryProxy: sentryProxyRouter,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
