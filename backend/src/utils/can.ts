import type { Pet, User, UserPermission } from '@prisma/client'

type MaybeUser = Pick<User, 'permissions' | 'id'> | null
type MaybePet = Pick<Pet, 'authorId'> | null

export const hasPermission = (user: MaybeUser, permission: UserPermission) => {
  return user?.permissions.includes(permission) || user?.permissions.includes('ALL') || false
}

export const canBlockPets = (user: MaybeUser) => {
  return hasPermission(user, 'BLOCK_PERSONS')
}

export const canUnblockPet = (user: MaybeUser) => {
  return hasPermission(user, 'BLOCK_PERSONS')
}

export const canApprovePet = (user: MaybeUser) => {
  return hasPermission(user, 'APPROVE_PERSON')
}

export const canEditPet = (user: MaybeUser, pet: MaybePet) => {
  return !!user && !!pet && user?.id === pet?.authorId
}

export const canEditStaticPages = (user: MaybeUser) => {
  return hasPermission(user, 'EDIT_STATIC_PAGES')
}

export const canManageBanners = (user: MaybeUser) => {
  return hasPermission(user, 'MANAGE_BANNERS')
}
