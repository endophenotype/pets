import { pgr } from '../utils/pumpGetRoute'

export const getSignUpRoute = pgr(() => '/sign-up')

export const getSignInRoute = pgr(() => '/sign-in')

export const getSignOutRoute = pgr(() => '/sign-out')

export const getEditProfileRoute = pgr(() => '/edit-profile')

export const getAllPetsRoute = pgr(() => '/')

export const getViewPetRoute = pgr({ nick: true }, ({ nick }) => `/pets/${nick}`)

export const getEditPetRoute = pgr({ nick: true }, ({ nick }) => `/pets/${nick}/edit`)

export const getNewPetRoute = pgr(() => '/pets/new')

export const getBlockedPetsRoute = pgr(() => '/pets/blocked')

export const getPendingPetsRoute = pgr(() => '/pets/pending')

export const getApprovedPetsRoute = pgr(() => '/pets/approved')

export const getReorderPetsRoute = pgr(() => '/admin/pets/reorder')

export const getStaticPageRoute = pgr({ slug: true }, ({ slug }) => `/${slug}`)

export const getAdminStaticPagesRoute = pgr(() => '/admin/static-pages')

export const getAdminBannersRoute = pgr(() => '/admin/banners')
