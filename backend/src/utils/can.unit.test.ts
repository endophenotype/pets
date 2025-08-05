import { canEditPet, hasPermission } from './can'

describe('can', () => {
  it('hasPermission return true for user with this permission', () => {
    expect(hasPermission({ permissions: ['BLOCK_PERSONS'], id: 'x' }, 'BLOCK_PERSONS')).toBe(true)
  })

  it('hasPermission return false for user without this permission', () => {
    expect(hasPermission({ permissions: [], id: 'x' }, 'BLOCK_PERSONS')).toBe(false)
  })

  it('hasPermission return true for user with "ALL" permission', () => {
    expect(hasPermission({ permissions: ['ALL'], id: 'x' }, 'BLOCK_PERSONS')).toBe(true)
  })

  it('only author can edit his pet', () => {
    expect(canEditPetpermissions: [], id: 'x' }, { authorId: 'x' })).toBe(true)
    expect(canEditPetpermissions: [], id: 'hacker' }, { authorId: 'x' })).toBe(false)
  })
})