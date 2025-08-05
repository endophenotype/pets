import { Navigate, Outlet } from 'react-router-dom'

import { trpc } from '../../lib/trpc'
import { Loader } from '../Loader'

export const AdminRoute = () => {
  const { data, isLoading } = trpc.getMe.useQuery()

  if (isLoading) {
    return <Loader type="page" />
  }

  if (
    !(
      data?.me?.permissions.includes('BLOCK_PETS') ||
      data?.me?.permissions.includes('ALL') ||
      data?.me?.permissions.includes('EDIT_STATIC_PAGES')
    )
  ) {
    return <Navigate to="/" />
  }

  return <Outlet />
}
