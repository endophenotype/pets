import type { TrpcRouterOutput } from '@pets/backend/src/router'
import { createContext, useContext, useMemo } from 'react'

import { Loader } from '../components/Loader'

import { trpc } from './trpc'

export type AppContext = {
  me: TrpcRouterOutput['getMe']['me']
}

const AppReactContext = createContext<AppContext>({
  me: null,
})

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  // @ts-expect-error Adding staleTime to prevent unnecessary refetching
  const { data, error, isLoading, isFetching, isError } = trpc.getMe.useQuery({ staleTime: Infinity })
  const value = useMemo(() => ({ me: data?.me || null }), [data])
  return (
    <AppReactContext.Provider value={value}>
      {isLoading || isFetching ? <Loader type="page" /> : isError ? <p>Error: {error.message}</p> : children}
    </AppReactContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppReactContext)
}

export const useMe = () => {
  const { me } = useAppContext()
  return me
}
