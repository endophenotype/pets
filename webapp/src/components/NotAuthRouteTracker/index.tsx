import { atom } from 'nanostores'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { getAllPetsRoute, getSignInRoute, getSignOutRoute, getSignUpRoute } from '../../lib/routes'

export const lastVisistedNotAuthRouteStore = atom(getAllPetsRoute())

export const NotAuthRouteTracker = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    const authRoutes = [getSignUpRoute(), getSignInRoute(), getSignOutRoute()]
    const isAuthRoute = authRoutes.includes(pathname)
    if (!isAuthRoute) {
      lastVisistedNotAuthRouteStore.set(pathname)
    }
  }, [pathname])

  return null
}
