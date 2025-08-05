import { canEditPet, hasPermission } from './can'

describe('can', () => {
  it('hasPermission return true for user with this permission', () => {
    expect(hasPermission({ permissions: ['BLOCK_PETS'], id: 'x' }, 'BLOCK_PETS')).toBe(true)
  })

  it('hasPermission return false for user without this permission', () => {
    expect(hasPermission({ permissions: [], id: 'x' }, 'BLOCK_PETS')).toBe(false)
  })

  it('hasPermission return true for user with "ALL" permission', () => {
    expect(hasPermission({ permissions: ['ALL'], id: 'x' }, 'BLOCK_PETS')).toBe(true)
  })

  it('only author can edit his pet', () => {
    expect(canEditPet({ permissions: [], id: 'x' }, { authorId: 'x' })).toBe(true)
    expect(canEditPet({ permissions: [], id: 'hacker' }, { authorId: 'x' })).toBe(false)
  })
})
