import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Loader } from '../../../components/Loader'
import { getSignInRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const SignOutPage = () => {
  const navigate = useNavigate()
  const trpcUtils = trpc.useContext()
  useEffect(() => {
    Cookies.remove('token-pets')
    void trpcUtils.invalidate().then(() => {
      navigate(getSignInRoute())
    })
  }, [])

  return <Loader type="section" />
}
